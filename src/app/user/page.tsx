export default function User() {
  return (
    <div className="flex items-center justify-center h-screen text-slate-700">
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded shadow-md w-96">
        <div className="mb-4">
          <img
            src={
              "https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
            }
            alt="User Avatar"
            className="w-16 h-16 rounded-full"
          />
        </div>
        <div className="mb-2">
          <p className="text-center text-gray-800">{"asdasdf"}</p>
        </div>

        <p>Use this code for register your visit</p>
        <img
          draggable={false}
          src={
            "https://play-lh.googleusercontent.com/lomBq_jOClZ5skh0ELcMx4HMHAMW802kp9Z02_A84JevajkqD87P48--is1rEVPfzGVf"
          }
          alt="QR Code"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Refresh code
        </button>
      </div>
    </div>
  );
}
