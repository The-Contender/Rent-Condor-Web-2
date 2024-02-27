$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://rc-express.vercel.app/", // Replace with the URL to your JSON file
        dataType: "json",
        success: function (data) {
            try {
                // Assuming the data is an array of objects and the first object contains column headers
                let allColumnHeaders = Object.keys(data[0]);

                // Mapping from JSON column headers to human-readable titles
                let columnTitleMapping = {
                    "address": "Address",
                    "zip1": "Zip",
                    "rent": "Rent",
                    "beds": "Beds",
                    "baths": "Baths",
                    "sqft": "Square Ft.",
                    "availability": "Available",
                    "property_manager": "Property Manager",
                    "listing_url": "Apply",
                    // Add more mappings as needed
                };

                // Filter column headers to include only those starting from "address"
                let columnHeaders = allColumnHeaders.slice(allColumnHeaders.indexOf("address"));

                // Extract data for the selected columns
                let tableData = data.map(function (row) {
                    let rowData = {};
                    columnHeaders.forEach(function (col) {
                        rowData[columnTitleMapping[col] || col] = row[col];
                    });
                    return rowData;
                });

                $('#csvTable').DataTable({
                    data: tableData,
                    columns: columnHeaders.map(function (col) {
                        let title = columnTitleMapping[col] || col;
                        if (col === "Link") {
                            return {
                                data: col,
                                title: title,
                                className: "sortable",
                                render: function (data, type, row) {
                                    return '<a href="' + data + '" target="_blank">Apply</a>';
                                }
                            };
                        } else {
                            return { data: col, title: title, className: "sortable" };
                        }
                    }),
                    "order": [], // Disable initial sorting
                    "scrollY": "400px", // Set the height of the scrollable area
                    "scrollX": true,
                    "paging": false, // Enable paging
                });
            } catch (error) {
                console.error("Error processing JSON data:", error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Failed to retrieve JSON data:", status, error);
        }
    });
});
