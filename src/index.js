import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;


const input = document.querySelector('input#search-box')
const countryCard = document.querySelector( '.country-info' );
const countryList = document.querySelector( '.country-list' );

countryList.style.listStyle = 'none';

input.addEventListener( 'input', debounce(inputHandler), DEBOUNCE_DELAY );

function inputHandler()
{
  const countryToSearch = input.value.trim();
  if ( countryToSearch.length === 0 )
  {
    countryCard.innerHTML = '';
    countryList.innerHTML = '';

    return;
  } else
  {
  fetchCountries(countryToSearch)
  }
};


//функція, яка робить запить на сервак 

function fetchCountries( countryToSearch )
{
  fetch( `https://restcountries.com/v3.1/name/${ countryToSearch }?fields=name,capital,population,flags,languages` )
    .then( response =>
    {
      if ( !response.ok )
      {
        throw new Error(response.status)
      }
      return response.json();
    })
    .then( data =>
    {
      console.log( data )
      rendererOfRequestResult( data );
    })
    .catch( error =>
    {
    //error handling;
      Notify.failure('Oops, there is no country with that name');
    })
}



function rendererOfRequestResult(countriesArr)
{
  const numberOfItemsToRender = countriesArr.length;
  if ( numberOfItemsToRender > 10 )
  {
    Notify.info( 'Too many matches found. Please enter a more specific name.' );
    countryCard.innerHTML = "";
    countryList.innerHTML = '';
    

  } else if ( numberOfItemsToRender === 1 )
  {
    countryList.innerHTML = '';
    renderCard( countriesArr );

  } else
  {
    countryCard.innerHTML = '';
    renderList( countriesArr );
  }
};

//Функия отрисовывает верстку списка

function renderList( arr )
{
  console.log( arr );

  const listMarkup = arr.map( country =>
  {
    return `<li style="margin-left:-40px;">
    <div style="display:flex; align-items:center; ">
    <img src="${ country.flags.svg }" width = "30px" alt="flag image" style="margin-right:10px;">
    <p style="display:block; font-size:13px; font-weight:700">${ country.name.official }</p>
    </div>
 </li>`
  } )
    .join( '' );
  
  countryList.innerHTML = listMarkup;
}

//функция отрисовывает верстку карточки страны

function renderCard( arr )
{
  const cardMarkup = arr.map( country =>
  {
    return `<h1>
    <div style="display:flex; align-items:center; margin-bottom:5px">
    <img src="${ country.flags.svg }" width = "60px" alt="flag image" style="margin-right:30px;">
    <p style="display:block; font-size:50px; font-weight:650">${ country.name.official }</p>
    </div>
</h1>
<p style="font-size:25px; font-weight:bold; display:block; margin-bottom:5px;">Capital:<span style="margin-left:10px; font-size:25px; font-weight:normal;" >${ country.capital }</span></p>
<p style="font-size:25px; font-weight:bold; display:block; margin-bottom:5px;">Population:<span style="margin-left:10px; font-size:25px; font-weight:normal;">${ country.population }</span></p>
<p style="font-size:25px; font-weight:bold; display:block; margin-bottom:5px;">Languages:<span style="margin-left:10px; font-size:25px; font-weight:normal;">${ Object.values(country.languages) }</span></p>`
  } )
    .join( '' );  
  countryCard.innerHTML = cardMarkup;
  countryList.innerHTML = '';  
}
