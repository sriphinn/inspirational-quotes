'use strict';

const giphyKey = 'bF6uAVhD0jSZnjjxQCktKLGZ7E8IKAgq';
const giphyURL = 'https://api.giphy.com/v1/gifs/search';

const STORE = {
    gifSearch: ""
};

function formatQueryParams(paramsObject) {
    const queryItems = Object.keys(paramsObject)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
    return queryItems.join('&');
};

function getGiphy(keyword) {
    const giphyParams = {
        q: keyword,
        api_key: giphyKey,
        limit: 1,
        rating: 'g'
    };
    const queryString = formatQueryParams(giphyParams);
    console.log(queryString)
    const url = giphyURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayGiphyResults(responseJson))
        .catch(err => {
            console.log(err)
        });
};

function getQuote(searchTerm) {
    fetch("https://type.fit/api/quotes")
        .then(function(response) {
        return response.json();
        })
        .then(responseJson => { 
            displayQuotes(responseJson, searchTerm)
            getGiphy(STORE.gifSearch)
        });

};

function displayGiphyResults(responseJson) {
    console.log("displayGiphyResults ran")
    $('#gif-results').empty();
    $('#results').removeClass('hidden');
    let image = "No GIFs found."
    // for (let i = 0; i < responseJson.data.length; i++) {
        if (responseJson.data[0].images.original) {
            image = `<img src="${responseJson.data[0].images.original.url}">` 
        // }
    }
    $('#gif-results').append(`${image}`)
}

function displayQuotes(responseJson, searchTerm) {
    console.log(responseJson,'displayQuotes ran')
    $('#quote-results').empty();
    $('#results').removeClass('hidden');
    let text = "No quotes found matching your search."
    for (let i = 0; i < responseJson.length; i++) {
        if (responseJson[i].text.includes(searchTerm)) {
            text = `<h3>${responseJson[i].text}<br><em>—${responseJson[i].author}</em></h3>`
            STORE.gifSearch = (responseJson[i].author || searchTerm)
            // console.log(STORE.gifSearch);
        };  
    }; 
    console.log(text)
    $('#quote-results').append(`${text}`);
};
    

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        console.log(searchTerm);
        getQuote(searchTerm);
    });
};

$(function() {
    console.log("App loaded! Waiting for user input and submit.");
    watchForm();
});