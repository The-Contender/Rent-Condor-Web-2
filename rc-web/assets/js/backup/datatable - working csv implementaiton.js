$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "assets/csv/test-full.csv", // Replace with the path to your CSV file
        dataType: "text",
        success: function (data) {
            try {
                Papa.parse(data, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function (result) {
                        let tableData = result.data;

                        $('#csvTable').DataTable({
                            data: tableData,
                            columns: Object.keys(tableData[0]).map(function (col) {
                                if (col === "Link") {
                                    return {
                                        data: col,
                                        title: col,
                                        className: "sortable",
                                        render: function (data, type, row) {
                                            return '<a href="' + data + '" target="_blank">Apply</a>';
                                        }
                                    };
                                } else {
                                    return { data: col, title: col, className: "sortable" };
                                }
                            }),
                            "order": [], // Disable initial sorting
                            "scrollY": "400px", // Set the height of the scrollable area
                            "scrollX": true,
                            "paging": false, // Enable paging
                        });
                    },
                    error: function (error) {
                        console.error("Error parsing CSV data:", error);
                    }
                });
            } catch (error) {
                console.error("Error processing CSV data:", error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Failed to retrieve CSV data:", status, error);
        }
    });
});
