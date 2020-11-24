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
        limit: 50,
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
    console.log("displayGiphyResults ran", responseJson)
    $('#gif-results').empty();
    $('#results').removeClass('hidden');
    let image = "No GIFs found."
    let k = Math.floor(Math.random()*responseJson.data.length)
    // for (let i = 0; i < responseJson.data.length; i++) {
        if (responseJson.data[k].images.original) {
            image = `<img src="${responseJson.data[k].images.original.url}">` 
        // }
    }
    $('#gif-results').append(`${image}`)
}

function displayQuotes(responseJson, searchTerm) {
    console.log(responseJson,'displayQuotes ran')
    $('#quote-results').empty();
    $('#results').removeClass('hidden');
    let quoteResults = []
    let text = "No quotes found matching your search, but here's a fun gif."
    for (let i = 0; i < responseJson.length; i++) {
        if (responseJson[i].text.includes(searchTerm)) {
            quoteResults.push(responseJson[i])
            // console.log(STORE.gifSearch);
            console.log("quoteResults", quoteResults)
            let j = Math.floor(Math.random()*quoteResults.length)
            text = `<h3>${quoteResults[j].text}<br><em>—${quoteResults[j].author}</em></h3>`
            STORE.gifSearch = (quoteResults[j].author || searchTerm)
        }; 
        if (quoteResults.length == 0) {
            STORE.gifSearch = (searchTerm)
        };
    }; 
    console.log(text)
    $('#quote-results').append(`${text}`);
};
    

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val().toLowerCase();
        console.log(searchTerm);
        getQuote(searchTerm);
    });
};

$(function() {
    console.log("App loaded! Waiting for user input and submit.");
    watchForm();
});