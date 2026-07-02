import { apiFetch } from "../lib/api";

export async function fetchCars(search = "", type = "") {
    try {
        let queryParams = [];
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (type) queryParams.push(`type=${encodeURIComponent(type)}`);
        
        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
        return await apiFetch(`/api/cars${queryString}`);
    } catch (error) {
        console.error("Error fetching cars:", error);
        throw error;
    }
}

export async function fetchCarById(id) {
    try {
        return await apiFetch(`/api/cars/${id}`);
    } catch (error) {
        console.error(`Error fetching car ${id}:`, error);
        throw error;
    }
}

export async function createCarListing(carData) {
    try {
        return await apiFetch("/api/cars", {
            method: "POST",
            body: carData
        });
    } catch (error) {
        console.error("Error creating car listing:", error);
        throw error;
    }
}

export async function fetchMyCars() {
    try {
        return await apiFetch("/api/my-cars");
    } catch (error) {
        console.error("Error fetching my cars:", error);
        throw error;
    }
}

export async function updateCarListing(id, carData) {
    try {
        return await apiFetch(`/api/cars/${id}`, {
            method: "PUT",
            body: carData
        });
    } catch (error) {
        console.error(`Error updating car ${id}:`, error);
        throw error;
    }
}

export async function deleteCarListing(id) {
    try {
        return await apiFetch(`/api/cars/${id}`, {
            method: "DELETE"
        });
    } catch (error) {
        console.error(`Error deleting car ${id}:`, error);
        throw error;
    }
}

export async function createBooking(bookingData) {
    try {
        return await apiFetch("/api/bookings", {
            method: "POST",
            body: bookingData
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
}

export async function fetchMyBookings() {
    try {
        return await apiFetch("/api/my-bookings");
    } catch (error) {
        console.error("Error fetching my bookings:", error);
        throw error;
    }
}

export async function cancelBooking(id) {
    try {
        return await apiFetch(`/api/bookings/${id}`, {
            method: "DELETE"
        });
    } catch (error) {
        console.error(`Error cancelling booking ${id}:`, error);
        throw error;
    }
}

export async function fetchStats() {
    try {
        return await apiFetch("/api/stats");
    } catch (error) {
        console.error("Error fetching stats:", error);
        throw error;
    }
}
