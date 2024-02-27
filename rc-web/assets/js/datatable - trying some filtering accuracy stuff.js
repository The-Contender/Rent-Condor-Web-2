$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://rc-express.vercel.app/", // Replace with the URL to your JSON file
        dataType: "json",
        success: function (data) {
            try {
                // Assuming the data is an array of objects and the first object contains column headers
                let allColumnHeaders = Object.keys(data[0]);

                // Filter column headers to include only those starting from "address"
                let columnHeaders = allColumnHeaders.slice(allColumnHeaders.indexOf("address")).filter(col => col !== "availability");

                // Extract data for the selected columns
                let tableData = data.map(function (row) {
                    let rowData = {};
                    columnHeaders.forEach(function (col) {
                        rowData[col] = row[col];
                    });
                    return rowData;
                });

                // DataTable initialization with dropdown filters
                let dataTable = $('#csvTable').DataTable({
                    data: tableData,
                    columns: columnHeaders.map(function (col) {
                        if (col === "url") {
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

                // Define which columns should have a dropdown filter
                let columnsWithDropdownFilter = ["zipcode"]; // Add column names as needed

                // Define which columns should have a numeric filter
                let columnsWithNumericFilter = ["rent", "beds", 'baths'];

                // Add dropdown filters for specific columns
                dataTable.columns().every(function () {
                    let column = this;

                    if (columnsWithDropdownFilter.includes(column.header().textContent)) {
                        // Create a dropdown element
                        let select = $('<select><option value=""></option></select>')
                            .appendTo($(column.header()))
                            .on('change', function () {
                                let val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );

                                // Apply the filter
                                column.search(val ? '^' + val + '$' : '', true, false).draw();
                            });

                        // Populate the dropdown with unique values from the column
                        column.data().unique().sort().each(function (d, j) {
                            select.append('<option value="' + d + '">' + d + '</option>');
                        });
                    } else if (columnsWithNumericFilter.includes(column.header().textContent)) {
                        // Add input field for numeric range filtering
                        let header = $(column.header());

                        $('<input type="text" placeholder="Min" class="datatable-filter-search" value="0"/>')
                            .appendTo(header)
                            .on('keyup change', function () {
                                applyNumericFilter();
                            });

                        $('<input type="text" placeholder="Max" class="datatable-filter-search" />')
                            .appendTo(header)
                            .on('keyup change', function () {
                                applyNumericFilter();
                            });
                    }
                });

                // Function to apply numeric filter
                function applyNumericFilter() {
                    dataTable.columns().every(function () {
                        let column = this;
                        if (columnsWithNumericFilter.includes(column.header().textContent)) {
                            let header = $(column.header());
                            let minVal = parseFloat(header.find('.min').val()) || -Infinity;
                            let maxVal = parseFloat(header.find('.max').val()) || Infinity;

                            // Apply the filter against the specified column
                            column
                                .min(minVal)
                                .max(maxVal)
                                .draw();
                        }
                    });
                }

                // Redraw the DataTable to ensure alignment
                dataTable.draw();

            } catch (error) {
                console.error("Error processing JSON data:", error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Failed to retrieve JSON data:", status, error);
        }
    });
});
