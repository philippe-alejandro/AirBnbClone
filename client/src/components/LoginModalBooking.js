export default function LoginModalBooking({handleCloseModal}) {

  return (
    <div className="modal-wrapper fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-black bg-opacity-30 shadow-lg" onClick={handleCloseModal}>
      <div className="bg-white rounded-md shadow-lg p-6">
        <h2 className="text-xl font-bold mb-2">You are not logged in!</h2>
        <p className="text-gray-600">Please log in before trying to book a place.</p>
        <button className="bg-primary hover:bg-primary-200 text-white font-bold py-2 px-4 mt-4 rounded-md" onClick={handleCloseModal}>Close</button>
      </div>
    </div>

  );
}