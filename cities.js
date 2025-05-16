// Cities data with images and facts
const cities = [
    {
        name: "Paris",
        country: "France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "The Eiffel Tower was built for the 1889 World's Fair.",
            "Paris is known as the 'City of Light'.",
            "The Louvre is the world's largest art museum."
        ],
        rarity: "common"
    },
    {
        name: "Tokyo",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Tokyo is the most populous metropolitan area in the world.",
            "Tokyo was formerly known as Edo.",
            "The city has over 200 Michelin-starred restaurants."
        ],
        rarity: "common"
    },
    {
        name: "New York",
        country: "United States",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d5b1a0b1a?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Over 800 languages are spoken in New York City.",
            "The New York subway system has 472 stations.",
            "Central Park was the first public park in America."
        ],
        rarity: "common"
    },
    {
        name: "Sydney",
        country: "Australia",
        image: "https://images.unsplash.com/photo-1523428096881-5bd79d043006?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "The Sydney Opera House took 14 years to build.",
            "Sydney Harbour Bridge is the world's largest steel arch bridge.",
            "Sydney has over 100 beaches."
        ],
        rarity: "common"
    },
    {
        name: "Cairo",
        country: "Egypt",
        image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Cairo is home to the only remaining Wonder of the Ancient World.",
            "The city's name means 'The Victorious' in Arabic.",
            "The Cairo Metro is the first metro in Africa."
        ],
        rarity: "rare"
    },
    {
        name: "Rio de Janeiro",
        country: "Brazil",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "The Christ the Redeemer statue is 30 meters tall.",
            "Rio has the largest urban forest in the world.",
            "The city hosted the 2016 Summer Olympics."
        ],
        rarity: "rare"
    },
    {
        name: "Marrakech",
        country: "Morocco",
        image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Marrakech is known as the 'Red City' due to its buildings.",
            "The medina of Marrakech is a UNESCO World Heritage site.",
            "It was founded in 1062 by the Almoravid dynasty."
        ],
        rarity: "rare"
    },
    {
        name: "Kyoto",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Kyoto was Japan's capital for over 1000 years.",
            "The city has more than 1,600 Buddhist temples.",
            "Kyoto was spared from bombing during WWII due to its cultural significance."
        ],
        rarity: "rare"
    },
    {
        name: "Venice",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Venice is built on 118 small islands.",
            "There are over 400 bridges in Venice.",
            "The city has no roads, just canals and walkways."
        ],
        rarity: "rare"
    },
    {
        name: "Petra",
        country: "Jordan",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Petra was carved into rose-colored rock faces.",
            "It was established around 312 BCE.",
            "Petra remained unknown to the Western world until 1812."
        ],
        rarity: "legendary"
    },
    {
        name: "Machu Picchu",
        country: "Peru",
        image: "https://images.unsplash.com/photo-1526392060635-9d601a8d1c3a?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Machu Picchu sits at 2,430 meters above sea level.",
            "It was built in the 15th century and later abandoned.",
            "The site was rediscovered in 1911 by Hiram Bingham."
        ],
        rarity: "legendary"
    },
    {
        name: "Angkor Wat",
        country: "Cambodia",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Angkor Wat is the largest religious monument in the world.",
            "It was built in the early 12th century.",
            "The temple appears on Cambodia's national flag."
        ],
        rarity: "legendary"
    },
    {
        name: "Atlantis",
        country: "Unknown",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
        facts: [
            "Atlantis is a legendary island mentioned by Plato.",
            "According to myth, it sank beneath the ocean.",
            "Many theories exist about its possible real location."
        ],
        rarity: "ultra-rare"
    }
];

// Function to get all cities
function getAllCities() {
    return cities;
}

// Function to get a random city
function getRandomCity() {
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
}

// Function to filter cities by rarity
function getCitiesByRarity(rarity) {
    return cities.filter(city => city.rarity === rarity);
}

// Function to get a random fact for a city
function getRandomFact(cityName) {
    const city = cities.find(c => c.name === cityName);
    if (city && city.facts.length > 0) {
        const randomIndex = Math.floor(Math.random() * city.facts.length);
        return city.facts[randomIndex];
    }
    return "No facts available for this city.";
} 