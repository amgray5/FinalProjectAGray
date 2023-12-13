// INF601 - Advanced Programming in Python
// Austin Gray
// Final Project

// Store the current sorting state
let sortDirection = {}; // Empty object to track sorting order

// Function to update arrow icons
function updateSortIcons(columnIndex, isAscending) {
    const arrowIcons = document.querySelectorAll('.arrow-icon');
    arrowIcons.forEach((icon, index) => {
        // Reset all arrow icons to default state
        icon.classList.remove('arrow-up', 'arrow-down');

        // Set arrow icon for the column being sorted
        if (index === columnIndex) {
            icon.classList.add(isAscending ? 'arrow-up' : 'arrow-down');
        }
    });
}


// Function to sort the table data
function sortTable(columnIndex) {
    const table = document.getElementById("dataTable");
    const rows = Array.from(table.querySelectorAll("tbody tr"));

    const isAscending = !sortDirection[columnIndex];

    // Sort rows based on the column index
    rows.sort((rowA, rowB) => {
        const cellA = rowA.querySelectorAll("td")[columnIndex].textContent.trim();
        const cellB = rowB.querySelectorAll("td")[columnIndex].textContent.trim();

        // Handle blank values by defaulting them to the top
        if (cellA === '' && cellB === '') {
            return 0; // If both cells are empty, consider them equal
        } else if (cellA === '') {
            return isAscending ? -1 : 1; // Sort empty cellA to the top
        } else if (cellB === '') {
            return isAscending ? 1 : -1; // Sort empty cellB to the top
        }

        let valueA = isNaN(cellA) ? cellA : parseFloat(cellA);
        let valueB = isNaN(cellB) ? cellB : parseFloat(cellB);

        if (!isNaN(valueA) && !isNaN(valueB)) {
            valueA = parseFloat(valueA);
            valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
            return isAscending ? -1 : 1;
        }
        if (valueA > valueB) {
            return isAscending ? 1 : -1;
        }
        return 0;
    });

    // Update the sorting direction for the column
    sortDirection = {};
    sortDirection[columnIndex] = isAscending;

    // Rearrange the rows in the table
    table.querySelector("tbody").innerHTML = "";
    rows.forEach((row) => {
        table.querySelector("tbody").appendChild(row);
    });

    // Update the arrow icons
    updateSortIcons(columnIndex, isAscending);
}
