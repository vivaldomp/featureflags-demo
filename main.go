package main

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

const FlagsObjectFile = "flags.json"

type Config struct {
	Endpoint        string `mapstructure:"ENDPOINT"`
	AccessKeyID     string `mapstructure:"ACCESS_KEY_ID"`
	SecretAccessKey string `mapstructure:"SECRET_ACCESS_KEY"`
	DdefaultBucket  string `mapstructure:"DEFAULT_BUCKET"`
}

func main() {

	var config Config
	viper.Unmarshal(&config)

	service, err := NewStorageService(&config)
	if err != nil {
		log.Fatalf("Error: %s", err)
	}
	controller, err := NewFlagController(service)

	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ready", controller.ReadyHandler)
	r.GET("/flags", controller.GetFlagsHandler)
	r.POST("/flags", controller.PostFlagsHandler)
	r.Run(":3000")

}

func init() {
	viper.AddConfigPath(".")
	viper.SetConfigType("env")
	viper.SetConfigName(".env")
	viper.AutomaticEnv()
	viper.BindEnv("ENDPOINT")
	viper.BindEnv("ACCESS_KEY_ID")
	viper.BindEnv("SECRET_ACCESS_KEY")
	viper.BindEnv("DEFAULT_BUCKET")

	if err := viper.ReadInConfig(); err == nil {
		log.Info("Using config file: ", viper.ConfigFileUsed())
	} else {
		log.Error(err)
		log.Info("Using environment variables provided from host.")
	}
}

type FlagController struct {
	service *StorageService
}

func NewFlagController(service *StorageService) (*FlagController, error) {
	return &FlagController{
		service: service,
	}, nil
}

func (f *FlagController) GetFlagsHandler(c *gin.Context) {
	email := c.Query("email")
	log.Infof("Received value from query param email: %s", email)

	data, err := f.service.Get(c.Request.Context(), FlagsObjectFile)

	if err != nil {
		messageError(c, http.StatusInternalServerError, err)
	}

	var flagMap FlagGroup
	json.Unmarshal(data, &flagMap)

	c.JSON(http.StatusOK, flagMap.Eval(email))
}

func (f *FlagController) PostFlagsHandler(c *gin.Context) {
	log.Info("Putting object flag.json to Object Store...")

	data, err := c.GetRawData()
	if err != nil {
		log.Error(err)
		messageError(c, http.StatusInternalServerError, err)
	}

	err = f.service.Put(c.Request.Context(), FlagsObjectFile, data)

	if err != nil {
		log.Error(err)
		messageError(c, http.StatusInternalServerError, err)
		return
	}
	c.Status(http.StatusCreated)
}

func (f *FlagController) ReadyHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func messageError(c *gin.Context, status int, err error) {
	c.AbortWithStatusJSON(status, gin.H{"message": err.Error()})
}

type StorageService struct {
	Client        *minio.Client
	DefaultBucket string
}

func NewStorageService(config *Config) (*StorageService, error) {
	minioClient, err := minio.New(config.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.AccessKeyID, config.SecretAccessKey, ""),
		Secure: false,
	})

	if err != nil {
		return nil, err
	}

	return &StorageService{
		Client:        minioClient,
		DefaultBucket: config.DdefaultBucket,
	}, nil
}

func (s *StorageService) Get(ctx context.Context, key string) ([]byte, error) {
	resource, err := s.Client.GetObject(
		ctx,
		s.DefaultBucket,
		key,
		minio.GetObjectOptions{},
	)
	if err != nil {
		return nil, err
	}

	defer resource.Close()

	resourceInfo, err := resource.Stat()

	if err != nil {
		return nil, err
	}

	log.Infof("Object %s found!", key)

	data := make([]byte, resourceInfo.Size)
	resource.Read(data)
	return data, nil
}
func (s *StorageService) Put(ctx context.Context, key string, data []byte) error {
	_, err := s.Client.PutObject(
		ctx,
		s.DefaultBucket,
		key,
		bytes.NewReader(data),
		int64(len(data)),
		minio.PutObjectOptions{ContentType: "application/json"})

	if err != nil {
		return err
	}
	return nil
}

type Rule struct {
	Value          interface{}    `json:"value"`
	EmailCondition EmailCondition `json:"condition"`
}

type EmailCondition struct {
	Email   string      `json:"email"`
	Replace interface{} `json:"replace"`
}

type FlagGroup map[string]*Rule
type Output map[string]interface{}

func (flagMap *FlagGroup) Eval(email string) Output {
	output := make(Output)
	for key, flagRule := range *flagMap {
		if flagRule.EmailCondition.Email == email {
			output[key] = flagRule.EmailCondition.Replace
		} else {
			output[key] = flagRule.Value
		}
	}
	return output
}
