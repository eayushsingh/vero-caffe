export default function AdminPage() {

    return (
        <div>

            <h2 className="text-2xl font-semibold mb-6">
                Dashboard Overview
            </h2>

            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-gray-500">
                        Total Menu Items
                    </h3>
                    <p className="text-3xl font-semibold mt-2">
                        12
                    </p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-gray-500">
                        Total Orders
                    </h3>
                    <p className="text-3xl font-semibold mt-2">
                        0
                    </p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-gray-500">
                        Total Users
                    </h3>
                    <p className="text-3xl font-semibold mt-2">
                        1
                    </p>
                </div>

            </div>

        </div>
    )
}
