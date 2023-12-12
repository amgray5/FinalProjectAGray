function downloadTemplate() {
    var link = document.createElement("a");
    link.download = "Add_Cards_Template.csv";
    link.href = "/download/Add_Cards_Template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function openSubWindow() {
    var subWindow = window.open('', '_blank', 'width=400,height=300');
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
            </style>
        </head>
        <body>
            <!-- Form for uploading CSV -->
            <h2>Upload CSV</h2>
            <form id="uploadForm" method="POST" action="/add_cards/oni" enctype="multipart/form-data">
                <input type="file" name="csvFile" accept=".csv"><br><br>
                <input type="submit" value="Submit">
            </form>
            <script>
                // Handle form submission
                document.getElementById("uploadForm").addEventListener("submit", function(event) {
                    event.preventDefault(); // Prevent default form submission
                    // Submit the form data asynchronously
                    var formData = new FormData(this);
                    fetch("/add_cards/oni", {
                        method: "POST",
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            // Close the sub-window
                            window.close();
                            // Reload the main window to display updated data
                            window.opener.location.reload();
                        } else {
                            alert("Failed to add cards. Please try again.");
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        alert("An error occurred while adding cards.");
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
