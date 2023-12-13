// INF601 - Advanced Programming in Python
// Austin Gray
// Final Project

function downloadTemplate() {
    var link = document.createElement("a");
    link.download = "Add_Cards_Template.csv";
    link.href = "/download/Add_Cards_Template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function openSubWindow(actionUrl) {
    var subWindow = window.open('', '_blank', 'width=600,height=500');
    var subWindowContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Add Cards</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #232323;
                    color: #fff;
                    margin: 0;
                    padding: 20px;
                }
                h2 {
                    text-align: center;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                input[type="file"] {
                    margin-bottom: 10px;
                }
                input[type="submit"] {
                    padding: 8px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                }
                input[type="submit"]:hover {
                    background-color: #0056b3;
                }
                .loader {
                    border: 16px solid #f3f3f3;
                    border-top: 16px solid #3498db;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 2s linear infinite;
                    margin: 50px auto; /* Adjust the margin for positioning */
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <!-- Form for uploading CSV -->
            <h2>Upload CSV</h2>
            <form id="uploadForm" method="POST" action="${actionUrl}" enctype="multipart/form-data">
                <input type="file" name="csvFile" accept=".csv"><br><br>
                <div id="loader" class="loader" style="display: none;"></div> <!-- Loader initially hidden -->
                <input id="submitButton" type="submit" value="Submit"> <!-- Submit button -->
            </form>
            <script>
                document.getElementById("uploadForm").addEventListener("submit", function(event) {
                    event.preventDefault(); // Prevent default form submission
                    // Show the loader and hide the submit button
                    document.getElementById("submitButton").style.display = "none";
                    document.getElementById("loader").style.display = "block";

                    var formData = new FormData(this);
                    fetch("${actionUrl}", {
                        method: "POST",
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            window.close();
                            window.opener.location.reload();
                        } else {
                            alert("Failed to add cards. Please try again.");
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        alert("An error occurred while adding cards.");
                    })
                    .finally(() => {
                        // Hide the loader and show the submit button again
                        document.getElementById("loader").style.display = "none";
                        document.getElementById("submitButton").style.display = "block";
                    });
                });
            <\/script>
        </body>
        </html>
    `;
    subWindow.document.write(subWindowContent);
    subWindow.document.close();
}
function setDatabaseIdAndSubmit() {
    var selectedRows = document.querySelectorAll('input[name="selected_rows"]:checked');
    var deleteForm = document.getElementById('deleteForm');

    if (selectedRows.length > 0) {
        selectedRows.forEach(function(row) {
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'selected_rows');
            hiddenInput.setAttribute('value', row.value);
            deleteForm.appendChild(hiddenInput);
        });

        // Trigger form submission
        deleteForm.submit();
    } else {
        alert('Please select at least one row for deletion.');
    }
}
function searchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput").value.toUpperCase();
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) { // Start from index 1 to skip the header row
        var display = "none";
        td = tr[i].getElementsByTagName("td");

        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(input) > -1) {
                    display = "";
                    break; // Display the row if found in any column
                }
            }
        }

        tr[i].style.display = display;
    }
}
// Event listener for input event on search bar
document.getElementById("searchInput").addEventListener("input", searchTable);

// Function to convert table data to CSV format
function convertToCSV(rows) {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Define columns to skip by index
    const skipColumns = [0, 13]; // Indexes of columns to skip: "Select" and "Card Photo URL"

    // Add header row
    csvContent += '"Database ID","Card Name","Foiling","Price","Type","CMC","Set Name","Color Identity","Set Code","Collector Number","Language Code","TCG ID"';

    // Add table data
    rows.forEach(row => {
        // Exclude columns to skip by index
        let filteredRow = row.filter((_, index) => !skipColumns.includes(index));

        // Replace em dashes with a hyphen (-) and encapsulate fields containing commas within double quotes
        let csvRow = filteredRow.map(field => {
            // Replace em dashes with a hyphen
            field = field.replace(/—/g, '-');

            // Encapsulate fields containing commas within double quotes
            if (/[,"]/.test(field)) {
                field = '"' + field.replace(/"/g, '""') + '"';
            }
            return field;
        }).join(",");

        csvContent += csvRow + "\n";
    });

    return encodeURI(csvContent);
}

// Function to trigger CSV download
function downloadCSV() {
    const table = document.getElementById("dataTable");
    const rows = Array.from(table.getElementsByTagName("tr"))
                    .map(row => Array.from(row.getElementsByTagName("td"))
                    .map(td => td.textContent.trim()));

    const csvContent = convertToCSV(rows);

    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
}
// Event listener for the Download CSV button
const downloadBtn = document.querySelector(".download-csv-btn");
downloadBtn.addEventListener("click", downloadCSV);
