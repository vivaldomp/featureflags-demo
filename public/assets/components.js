const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen w-1/6  flex flex-col items-center p-4">
      <h2 className="text-2xl font-semibold mb-4">Flags</h2>
      <ul className="text-lg">
        <li className="mb-2 cursor-pointer hover:text-red-400">New</li>
        <li className="mb-2 cursor-pointer hover:text-red-400">Edit</li>
        <li className="mb-2 cursor-pointer hover:text-red-400">Delete</li>
        <li className="mb-2 cursor-pointer hover:text-red-400">Find</li>
      </ul>
    </div>
  );
};

// Flag 'TOGGLE_HEADER_BACKGROUND_COLOR' usage

const Header = ({ email, onLogout }) => {
  const { getFlag } = useFlagContext();
  return (
    <div className={`${getFlag('TOGGLE_HEADER_BACKGROUND_COLOR')} text-white py-4 px-8 flex justify-between items-center`}>
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {email}!</h1>
      </div>
      <div>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// Flag 'TOGGLE_VIEW_GROW_RATE' usage
const Widgets = () => {
  const { isFlagOn } = useFlagContext();
  return (
    <div className="flex justify-around mt-8">
      <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center w-1/4">
        <h2 className="text-2xl font-semibold mb-2">Total Accounts</h2>
        <p className="text-3xl">500</p>
      </div>
      <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center w-1/4">
        <h2 className="text-2xl font-semibold mb-2">Orders per Month</h2>
        <p className="text-3xl">1200</p>
      </div>
      {isFlagOn('TOGGLE_VIEW_GROW_RATE') && <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center w-1/4">
        <h2 className="text-2xl font-semibold mb-2">Grow Rate %</h2>
        <p className="text-3xl">15%</p>
      </div>}
      {!isFlagOn('TOGGLE_VIEW_GROW_RATE') && <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center w-1/4">
        <h2 className="text-2xl font-semibold mb-2">Page Views</h2>
        <p className="text-3xl">4500</p>
      </div>}
    </div>
  );
};

const LastAccessList = () => {
  const activities = [
    { id: 1, date: '2023-10-04', description: 'User edited profile', log: 'Profile details updated.' },
    { id: 2, date: '2023-10-02', description: 'User created flag', log: 'Flag ID: 10 created.' },
    { id: 3, date: '2023-09-27', description: 'User deleted post', log: 'Post ID: 123 deleted.' },
    { id: 4, date: '2023-09-25', description: 'User edited flag', log: 'Flag ID: 8 updated.' },
    { id: 5, date: '2023-09-12', description: 'User deleted flag', log: 'Flag ID: 5 deleted.' },
    { id: 6, date: '2023-09-07', description: 'User create flag', log: 'Flag ID: 5 created.' },
    { id: 7, date: '2023-09-01', description: 'User edited flag', log: 'Flag ID: 4 updated.' },
  ];

  return (
    <div className="container p-8">
      <h1 className="text-2xl font-semibold mb-8">System Activities</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border bg-gray-200 px-4 py-2">Date</th>
              <th className="border bg-gray-200 px-4 py-2">Description</th>
              <th className="border bg-gray-200 px-4 py-2">Log</th>
              <th className="border bg-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="border px-4 py-2">{activity.date}</td>
                <td className="border px-4 py-2">{activity.description}</td>
                <td className="border px-4 py-2">{activity.log}</td>
                <td className="border px-4 py-2">
                  <button className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="bg-gray-300 text-gray-700 text-center py-4">
      ACME &copy; {new Date().getFullYear()}
    </div>
  );
};