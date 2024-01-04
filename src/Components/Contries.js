
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import axios from 'axios'; // Pour effectuer des requêtes HTTP
import 'bootstrap/dist/css/bootstrap.min.css'; 


export const Contrie = () => {
  return (
    <Router>
      <div className="container mt-4">
        <h1 className="display-4"> Countries App</h1>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">Accueil</Link> 
              {/* "/" représente le chemin d'accès à la racine de l'application. */}
            </li>
            <li className="nav-item">
              <Link to="/countries" className="nav-link">Liste des pays</Link>
            </li>
          </ul>
        </nav>

        <hr />

        {/* Configuration des routes principales de l'application */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/countries/*" element={<CountryList />} />
        </Routes>
      </div>
    </Router>
  );
}

// Composant pour la page d'accueil
const Home = () => {
  return <h2 className="display-5">Bienvenue sur la page d'accueil</h2>;
}

// Composant pour afficher la liste des pays
const CountryList = () => {
  // State pour stocker la liste complète des pays et la liste filtrée
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  // State pour gérer le terme de recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Utilisation du hook useEffect pour récupérer la liste des pays au chargement initial de la page
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v2/all');
        setCountries(response.data);
        setFilteredCountries(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des pays', error);
      }
    };

    fetchCountries();
  }, []);

  // Utilisation du hook useEffect pour filtrer la liste des pays en fonction du terme de recherche
  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  return (
    <div>
      {/* Barre de recherche */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un pays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Affichage de la liste des pays  */}
      <h2 className="display-5">Liste des pays</h2>
      <div className="row">
        {filteredCountries.map(country => (
          <div key={country.alpha3Code} className="col-md-4 mb-3">
            <div className="card">
              <img src={country.flag} className="card-img-top" alt={`${country.name} Flag`} />
              <div className="card-body">
                <h5 className="card-title">{country.name}</h5>
                {/* Bouton pour voir les détails d'un pays */}
                <Link to={`/${country.alpha3Code}`} className="btn btn-primary">Voir les détails</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr />

      {/* Configuration des routes pour les détails d'un pays */}
      <Routes>
        <Route path="/" element={<p className="lead">Veuillez sélectionner un pays.</p>} />
        <Route path="/:alpha3Code" element={<CountryDetails />} />
      </Routes>
    </div>
  );
}

// Composant pour afficher les détails d'un pays
const CountryDetails = () => {
  const { alpha3Code } = useParams();
  const [countryDetails, setCountryDetails] = useState(null);

  // Utilisation du hook useEffect pour récupérer les détails d'un pays en fonction de son code alpha3
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://restcountries.com/v2/alpha/${alpha3Code}`);
        setCountryDetails(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du pays', error);
      }
    };

    fetchData();
  }, [alpha3Code]);

  // Affichage des détails du pays
  if (!countryDetails) {
    return <p className="lead">Chargement en cours...</p>;
  }

  return (
    <div>
      <h3 className="display-6">{countryDetails.name}</h3>
      <img src={countryDetails.flags.svg} alt={`${countryDetails.name} Flag`} style={{ marginBottom: '10px', width: '150px' }} />
      <p>Capitale: {countryDetails.capital}</p>
      <p>Région: {countryDetails.region}</p>
      <p>Population: {countryDetails.population}</p>
    </div>
  );
}