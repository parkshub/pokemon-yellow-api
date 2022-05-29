log = console.log
let choiceRaw
let choice
let flavorText
let stats
let idx
let gender
let typeContainer = document.querySelector('#types')
let statsContainer = document.querySelector('#stats')

// first go through https://pokeapi.co/api/v2/pokedex/2/

if (!localStorage.getItem('fullList')){
  log('grabbing pokemon list')
  fetch ('https://pokeapi.co/api/v2/pokedex/2/')
    .then(res => res.json())
    .then(data => {
      // log(data.pokemon_entries[0].pokemon_species.name)
      let tempList = data.pokemon_entries.map(x=> x.pokemon_species.name)
      // log(tempList)
      localStorage.setItem('fullList', tempList)
  })
}

const fullList = localStorage.getItem('fullList')

document.querySelector('.unhide').addEventListener('click', hideAndFetch)

function hideAndFetch(){
  let hiders = document.querySelectorAll('.unhide')
  hiders.forEach(x => x.classList.toggle('hidden'))
}



document.querySelector('#search').addEventListener('click', getFetch)

function getFetch(){
  
  choiceRaw = document.querySelector('input').value.toLowerCase()
  let reg = new RegExp('\\b('+choiceRaw+')\\b')

  if (fullList.match(reg)) {
    
    if (choiceRaw == 'nidoran') {
      let hiders = document.querySelectorAll('.hidden')
      hiders.forEach(x => x.classList.toggle('hidden'))
      
      document.querySelector('#male').addEventListener('click', function(){
        choice = choiceRaw + '-m'
      })
      document.querySelector('#female').addEventListener('click', function(){
        choice = choiceRaw + '-f'
      })    }
    else {
      choice = choiceRaw
    }
    
    document.querySelector('#name').innerText = choice[0].toUpperCase() + choice.slice(1)

    // grabbing flavor text 
    fetch ('https://pokeapi.co/api/v2/pokedex/2/')
      .then (res => res.json())
      .then (data => {
        let flavorTextURL = data.pokemon_entries.map(x => x.pokemon_species).filter(x => x.name == choice)[0].url
        fetch (flavorTextURL)
          .then (res => res.json())
          .then (data =>{
            flavorText = data.flavor_text_entries.filter(x => x.version.name == 'yellow')[0].flavor_text.split('\n').join(' ').split('').join(' ')
            document.querySelector('#flavorText').innerText = flavorText
          })
      })

    // grabbing stats, img, types, height, weight, index number
    fetch('https://pokeapi.co/api/v2/pokemon/' + choice)
      .then (res => res.json())
      .then (data => {
        // log(data)
        // height
        height = (Number(data.height) * 0.1) + ' m'
        // weight
        weight = (Number(data.weight) * 0.1) + ' kg'
        // index number
        idx = data.game_indices.filter(x => x.version.name == 'yellow')[0].game_index
        // img
        // document.querySelector('#pokemonImg').src = data.sprites.versions['generation-i'].yellow.front_transparent
        document.querySelector('#pokemonImg').src = data.sprites.versions['generation-i'].yellow.front_default
        // types
        data.types.forEach(x =>{ 
          let li = document.createElement('li')
          li.innerText = x.type.name
          typeContainer.appendChild(li)
        })
        // stats
        data.stats.forEach(x => {
          let li = document.createElement('li')
          li.innerText = x.stat.name + ' ' + x.base_stat
          statsContainer.appendChild(li)
        })
        
      })

  }
  else {
    alert('Please input a pokemon from version yellow.')
  }
}

// you forgot to add their indexx numbers, add that in later for project!!!!