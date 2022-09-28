Intro: 
- I decided to go with a nextJS app so I could have both BE & FE in the same repo for simplicity. 
- I added materialUI & jest because that's what I usually use as a UI lib and testing framework, respectively. 
- to run the app  
  - rename env.example to .env and add the API_KEY
  - yarn install
  - yarn build
  - yarn start

What I focused on: 
- making the BE scalable - fetching photos in parallel, not sequentially 
- making the BE robust - handling possible missing data (fallback photo) 
- having good tests 
- having good separation of concerns 
  - BE: pages/api/places acts as the controller that does all http validations & handling while services/places acts as the service resposible for all the business logic and is completely free of http dependencies 
  - FE: pages/index acts as the orchestrator that stores all data while components/Header & components/Place are pure components that rely only on the props they receive
- having good project structure 
  - BE: api/clients - we could easily implement other api clients that would fetch places from other sources 

What I did not focus on: 
- having perfect UI / UX - after having the places' grid & the header responsive I focused on the items in the section above 

Things that I would do before going to prod: 
- [must] have better monitoring for unexpected errors (marked the places in the code with LOGGING) 
- [must] inject env vars at build time 
- [nice] since it's such a critical part of the app, add more ways to fetch the user's current location 
- [maybe] add some kind state management layer (either redux or context/provider). I decided not to implement this because we are only handling 1 type of resources right now 

BE improvements:  
- create a PlacesProvider asbtraction so we could easily change the source of the data, i.e., right now we are solely relying on foursquare's API, we could have multiple APIs from which to fetch places around the user. this would make our BE more resilient to failures 

FE improvements (I did not spend time doing time since the position is for a BE role): 
- better error handling in the UI -> show some error toasts, add an input component so the user would have been able to set his lat/long if he didnt want to allow the browser to access his location 
- have a loading state while we are fetching the places 
- truncating place's names if they are too big 
