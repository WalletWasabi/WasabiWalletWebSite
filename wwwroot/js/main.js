// Function to load language from JSON file
function loadLanguage(languageCode) {
    $.ajax({
        url: `languages/${languageCode}.json`,
        dataType: 'json',
        async: false,
        success: function(data) {
            $.each(data, function(key, value) {
                $(`[data-lang="${key}"]`).html(value);
            });
        },
        error: function() {
            console.error('Error loading language file.');
        }
    });
}

// Function to set the selected language in local storage
function setLanguageLocalStorage(languageCode) {
    localStorage.setItem('selectedLanguage', languageCode);
}

// Function to get the selected language from local storage
function getLanguageFromLocalStorage() {
    return localStorage.getItem('selectedLanguage');
}

// Function to populate the language selector with options
function populateLanguageSelector() {
    $.ajax({
        url: 'languages',
        dataType: 'html',
        async: false,
        success: function(data) {
            // Parse the directory listing to extract language codes
            const languageSelector = $('#language-selector');
            const languageCodes = [];

            // Find all ".json" links in the directory listing
            const jsonLinks = $(data).find('a[href$=".json"]');

            // Extract language codes from the links
            jsonLinks.each(function() {
                const linkHref = $(this).attr('href');
                const languageCode = linkHref.substring(linkHref.length - 7, linkHref.length - 5);
                if (languageCode.length === 2) {
                    languageCodes.push(languageCode);
                }
            });

            // Add language options to the selector
            languageCodes.forEach(function(languageCode) {
                languageSelector.append(`<option value="${languageCode}">${languageCode}</option>`);
            });

            // Check if a selected language exists in local storage and select it
            const savedLanguage = getLanguageFromLocalStorage();
            if (savedLanguage) {
                languageSelector.val(savedLanguage);
                loadLanguage(savedLanguage);
            }
        },
        error: function(error) {
            console.error('Error populating language selector.');
        }
    });
}

// Populate the language selector on page load
populateLanguageSelector();

// Event listener for language selection change
$('#language-selector').on('change', function() {
    const selectedLanguage = $(this).val();
    loadLanguage(selectedLanguage);
    setLanguageLocalStorage(selectedLanguage);
});
