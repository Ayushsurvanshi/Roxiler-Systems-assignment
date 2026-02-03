import React, { useEffect, useState } from 'react';
import '../App.css'; // Import App.css for general styles
import api from '../utils/api';

const OwnerDashboard = () => {
    const [ratingsSubmitted, setRatingsSubmitted] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                // Fetch users who submitted ratings for owner's store
                const ratingsRes = await api.get('/owner/my-store-ratings');
                setRatingsSubmitted(ratingsRes.data);

                // Fetch average rating for owner's store
                const avgRatingRes = await api.get('/owner/my-store-average-rating');
                setAverageRating(avgRatingRes.data.average_rating);
            } catch (err) {
                console.error('Error fetching owner dashboard data', err);
                setError('Failed to load owner dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchOwnerData();
    }, []);

    if (loading) return <div className="container">Loading owner dashboard...</div>;
    if (error) return <div className="container alert alert-danger">Error: {error}</div>;

    return (
        <div className="container">
            <h2>Store Owner Dashboard</h2>

            <div className="dashboard-card-container" style={{ marginBottom: '30px' }}>
                <div className="dashboard-card">
                    <h3>Average Store Rating</h3>
                    <p>{averageRating ? parseFloat(averageRating).toFixed(2) : 'N/A'}</p>
                </div>
            </div>

            <h3>Users Who Submitted Ratings</h3>
            {ratingsSubmitted.length === 0 ? (
                <p>No users have submitted ratings for your store yet.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>Store Name</th>
                                <th>Rating</th>
                                <th>Date Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratingsSubmitted.map((rating, index) => (
                                <tr key={index}>
                                    <td>{rating.user_name}</td>
                                    <td>{rating.user_email}</td>
                                    <td>{rating.store_name}</td>
                                    <td>{rating.rating}</td>
                                    <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
