import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faComments,
  faHeart,
  faEye,
  faUser,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Loading from "../../layouts/Loading";

/* AnalyticsCard component */
function AnalyticsCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
      <FontAwesomeIcon icon={icon} className="text-4xl text-indigo-500" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
    </div>
  );
}

/* Dashboard component */
function Dashboard() {
  const [isLoading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    TotalPosts: 0,
    TotalComment: 0,
    TotalLikes: 0,
    TotalVisits: 0,
    TotalCategories: 0,
    TotalUsers: 0,
    ActifUsers: 0,
    MonthlyVisits: [],
    MonthlyPosts: [],
    MonthlyComments: [],
  });

  // Simulate fetching data with mock data after delay
  useEffect(() => {
    setTimeout(() => {
      setDashboardData({
        TotalPosts: 45,
        TotalComment: 120,
        TotalLikes: 320,
        TotalVisits: 5000,
        TotalCategories: 12,
        TotalUsers: 350,
        ActifUsers: 200,
        MonthlyVisits: [
          { month: "January", visit_count: 400 },
          { month: "February", visit_count: 450 },
          { month: "March", visit_count: 500 },
          { month: "April", visit_count: 550 },
          { month: "May", visit_count: 600 },
          { month: "June", visit_count: 650 },
          { month: "July", visit_count: 700 },
          { month: "August", visit_count: 750 },
          { month: "September", visit_count: 800 },
          { month: "October", visit_count: 850 },
          { month: "November", visit_count: 900 },
          { month: "December", visit_count: 950 },
        ],
        MonthlyPosts: [
          { month: "January", post_count: 5 },
          { month: "February", post_count: 6 },
          { month: "March", post_count: 7 },
          { month: "April", post_count: 8 },
          { month: "May", post_count: 9 },
          { month: "June", post_count: 10 },
          { month: "July", post_count: 11 },
          { month: "August", post_count: 12 },
          { month: "September", post_count: 13 },
          { month: "October", post_count: 14 },
          { month: "November", post_count: 15 },
          { month: "December", post_count: 16 },
        ],
        MonthlyComments: [
          { month: "January", comment_count: 10 },
          { month: "February", comment_count: 20 },
          { month: "March", comment_count: 30 },
          { month: "April", comment_count: 40 },
          { month: "May", comment_count: 50 },
          { month: "June", comment_count: 60 },
          { month: "July", comment_count: 70 },
          { month: "August", comment_count: 80 },
          { month: "September", comment_count: 90 },
          { month: "October", comment_count: 100 },
          { month: "November", comment_count: 110 },
          { month: "December", comment_count: 120 },
        ],
      });
      setLoading(true); // Simulate API data fetch completion
    }, 1000);
  }, []);

  const dashboardContent = isLoading ? (
    <div className="container mx-auto mt-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Total Posts"
          value={dashboardData.TotalPosts}
          icon={faFileAlt}
        />
        <AnalyticsCard
          title="Total Comments"
          value={dashboardData.TotalComment}
          icon={faComments}
        />
        <AnalyticsCard
          title="Likes Received"
          value={dashboardData.TotalLikes}
          icon={faHeart}
        />
        <AnalyticsCard
          title="Total Visits"
          value={dashboardData.TotalVisits}
          icon={faEye}
        />
        <AnalyticsCard
          title="Total Categories"
          value={dashboardData.TotalCategories}
          icon={faFolder}
        />
        <AnalyticsCard
          title="Total Users"
          value={dashboardData.TotalUsers}
          icon={faUser}
        />
      </div>
      <Analytics
        Visits={dashboardData.MonthlyVisits}
        Posts={dashboardData.MonthlyPosts}
        Comments={dashboardData.MonthlyComments}
      />
    </div>
  ) : (
    <Loading />
  );

  return <AdminLayout Content={dashboardContent} />;
}

/* Analytics component */
function Analytics({ Visits, Posts, Comments }) {
  if (Visits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-5">
        <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
        <p>No data available. Please check back later.</p>
      </div>
    );
  }

  const orderedMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const postCounts = new Array(12).fill(0);
  const TotalComment = new Array(12).fill(0);

  Posts.forEach((item) => {
    const monthIndex = orderedMonths.indexOf(item.month);
    if (monthIndex !== -1) {
      postCounts[monthIndex] = item.post_count;
    }
  });

  Comments.forEach((item) => {
    const monthIndex = orderedMonths.indexOf(item.month);
    if (monthIndex !== -1) {
      TotalComment[monthIndex] = item.comment_count;
    }
  });

  const VisitsChart = {
    labels: orderedMonths,
    datasets: [
      {
        label: "Visits",
        data: Visits.map((item) => item.visit_count),
        borderColor: "rgba(255, 159, 0, 1)", // Darker yellow
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const PostsChart = {
    labels: orderedMonths,
    datasets: [
      {
        label: "Posts",
        data: postCounts,
        borderColor: "rgba(54, 162, 235, 1)", // Darker blue
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const CommentsChart = {
    labels: orderedMonths,
    datasets: [
      {
        label: "Comments",
        data: TotalComment,
        borderColor: "rgba(153, 102, 255, 1)", // Darker purple
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "category",
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md my-5 p-2">
        <h2 className="text-2xl font-semibold mb-4">Visits Chart</h2>
        <Line data={VisitsChart} options={chartOptions} />
      </div>
      <div className="bg-white rounded-lg shadow-md my-5 p-2">
        <h2 className="text-2xl font-semibold mb-4">Posts Chart</h2>
        <Line data={PostsChart} options={chartOptions} />
      </div>
      <div className="bg-white rounded-lg shadow-md my-5 p-2">
        <h2 className="text-2xl font-semibold mb-4">Comments Chart</h2>
        <Line data={CommentsChart} options={chartOptions} />
      </div>
    </>
  );
}

export default Dashboard;
