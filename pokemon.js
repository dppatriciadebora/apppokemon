const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
let offset = 0; // Permite reatribuição ao carregar mais Pokémon
const limit = 10;

// Função para converter os tipos do Pokémon em elementos <li>
function convertPokemonTypesToLi(pokemonTypes) {
    return pokemonTypes
        .map((typeSlot) => {
            const type = typeSlot.type.name;
            return `<li class="type ${type}">${type}</li>`;
        })
        .join('');
}

// Função para converter as habilidades em elementos <li>
function convertPokemonAbilitiesToLi(abilities) {
    return abilities
        .map((abilitySlot) => {
            const ability = abilitySlot.ability.name;
            return `<li>${ability}</li>`;
        })
        .join('');
}

// Função para converter estatísticas base em elementos <li>
function convertPokemonStatsToLi(stats) {
    return stats
        .map((statSlot) => {
            const statName = statSlot.stat.name.replace('-', ' ').toUpperCase();
            const baseStat = statSlot.base_stat;
            return `<li><strong>${statName}:</strong> ${baseStat}</li>`;
        })
        .join('');
}

// Função para converter movimentos em elementos <li>
function convertPokemonMovesToLi(moves) {
    const topMoves = moves.slice(0, 5); // Limita a exibição aos 5 primeiros movimentos
    return topMoves
        .map((moveSlot) => {
            const moveName = moveSlot.move.name.replace('-', ' ');
            return `<li>${moveName}</li>`;
        })
        .join('');
}

// Função principal para renderizar um Pokémon como <li>
function convertPokemonToLi(pokemon) {
    const mainType = pokemon.types[0].type.name; // Primeiro tipo do Pokémon
    return `
    <li class="pokemon ${mainType}">
        <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>
        <span class="name">${pokemon.name}</span>
       
        <div class="detail">
            <ol class="types">
                ${convertPokemonTypesToLi(pokemon.types)}
            </ol>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg"
                 alt="${pokemon.name}">
        </div>
        
        <div class="abilities">
            <h4>Abilities:</h4>
            <ul>
                ${convertPokemonAbilitiesToLi(pokemon.abilities)}
            </ul>
        </div>

        <div class="stats">
            <h4>Base Stats:</h4>
            <ul>
                ${convertPokemonStatsToLi(pokemon.stats)}
            </ul>
        </div>

        <div class="additional-info">
            <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
        </div>

        <div class="moves">
            <h4>Top Moves:</h4>
            <ul>
                ${convertPokemonMovesToLi(pokemon.moves)}
            </ul>
        </div>
    </li>`;
}

// Objeto principal responsável pela busca dos Pokémon
const pokeAPI = {};

// Função para buscar Pokémon na API
pokeAPI.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            return response.json();
        })
        .then((jsonBody) => jsonBody.results) // Pega a lista básica de Pokémon
        .then((pokemons) =>
            Promise.all(pokemons.map((pokemon) => fetch(pokemon.url).then((res) => res.json())))
        )
        .catch((error) => {
            console.error('Erro ao buscar Pokémon:', error);
        });
};

// Função para carregar os Pokémon e atualizar o HTML
function loadPokemonItems(offset, limit) {
    pokeAPI.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

// Carregar Pokémon na inicialização
loadPokemonItems(offset, limit);

// Botão "Load More" para carregar mais Pokémon
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);
        loadMoreButton.remove(); // Remove o botão após o carregamento final
    } else {
        loadPokemonItems(offset, limit);
    }
});




