$(document).ready(function () {
    // Handle tab change event
    $('.nav-link').on('click', function () {
        // Get the ID of the selected tab
        var selectedTabId = $(this).attr('data-bs-target');

        // Extract the image index from the tab ID (assuming it's in the format 'nav-X')
        var imageIndex = selectedTabId.split('-').pop();

        // Update the image source based on the selected tab
        $('#tabImage').attr('src', 'assets/images/about/about-img-' + imageIndex + '.jpg');
    });
});