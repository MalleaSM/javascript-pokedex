const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");
const closeButton = document.querySelector(".search-cross-icon");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
});

const fetchPokemonDataBeforeRedirect = async (id) => {
    try{
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res)=> res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((res)=> res.json()),
        ]);       

        return true;
    } catch(error){
        console.error('Failed to fetch Pokemon data before redirect')
    };
}

const displayPokemons = (pokemonList) => {
    listWrapper.innerHTML="";
    pokemonList.forEach((pokemon) => {
        const pokemonId = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonId}</p>
            </div>
            <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" alt="${pokemon.name}"/>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        </div>
        `
        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokemonId);
            if(success){
                window.location.href = `./details.html?id=${pokemonId}`;
            }
        })  
        
        listWrapper.appendChild(listItem);
    });
}

const handleSearch = () => {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;
    if(numberFilter.checked){
        filteredPokemons = allPokemons.filter((pokemon)=>{
            const pokemonId = pokemon.url.split("/")[6];
            return pokemonId.startsWith(searchTerm);
        })
    } else if (nameFilter.checked){
        filteredPokemons = allPokemons.filter((pokemon)=>{
           return pokemon.name.toLowerCase().startsWith(searchTerm) 
        })
   } else {
    filteredPokemons = allPokemons
   }

   displayPokemons(filteredPokemons)
   if(filteredPokemons.length === 0){
    notFoundMessage.style.display = 'block'
   } else {
    notFoundMessage.style.display = 'none'
   }
}

const clearSearch = () => {
    searchInput.value= "";
    displayPokemons(allPokemons);
    notFoundMessage.style.display = 'none'
}

searchInput.addEventListener("keyup", handleSearch);
closeButton.addEventListener("click" ,clearSearch);
