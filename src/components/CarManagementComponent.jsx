import React, { useState, useEffect } from 'react';
import axiosInstance from "../services/axiosInstance";
import '../styles/Car.css';
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'

const CarManagementComponent = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [client, setClient] = useState('');

  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:8000/Garage/cars/');
      setCars(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des voitures :', error);
    }
  };

  const addCar = async () => {
    const carToAdd = { registration_number: registrationNumber, brand, model, status, assigned_employee: assignedEmployee, client };
    try {
      await axiosInstance.post('http://localhost:8000/Garage/cars/add/', carToAdd);
      fetchCars();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l’ajout de la voiture :', error);
    }
  };

  const updateCar = async () => {
    if (selectedCar) {
      const updatedCar = { registration_number: registrationNumber, brand, model, status, assigned_employee: assignedEmployee, client };
      try {
        await axiosInstance.put(`http://localhost:8000/Garage/cars/${selectedCar.registration_number}/update/`, updatedCar);
        fetchCars();
        resetForm();
        setSelectedCar(null);
        setEditMode(false);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la voiture :', error);
      }
    }
  };

  const deleteCar = async (registration) => {
    try {
      await axiosInstance.delete(`http://localhost:8000/Garage/cars/${registration}/delete/`);
      fetchCars();
    } catch (error) {
      console.error('Erreur lors de la suppression de la voiture :', error);
    }
  };

  const selectCar = (car) => {
    setSelectedCar(car);
    setRegistrationNumber(car.registration_number);
    setBrand(car.brand);
    setModel(car.model);
    setStatus(car.status);
    setAssignedEmployee(car.assigned_employee);
    setClient(car.client);
    setEditMode(true);
  };

  const resetForm = () => {
    setRegistrationNumber('');
    setBrand('');
    setModel('');
    setStatus('in_progress');
    setAssignedEmployee('');
    setClient('');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    navigate('/login'); // Redirection vers la page de login
  };

  return (
    <div className="container">
      <h2>Gestion des Voitures</h2>
      {/* Bouton de déconnexion */}
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Se déconnecter
      </button>

      {/* Liste des voitures */}
      <ul>
        {cars.map((car) => (
          <li key={car.registration_number}>
            <strong>{car.brand} {car.model}</strong> ({car.registration_number}) - {car.status}
            <button onClick={() => selectCar(car)}>Modifier</button>
            {role === 'admin' && <button onClick={() => deleteCar(car.registration_number)}>Supprimer</button>}
          </li>
        ))}
      </ul>

      {/* Formulaire d'ajout ou de modification */}
      <div>
        <h3>{editMode ? 'Modifier Voiture' : 'Ajouter une Voiture'}</h3>

        <form onSubmit={(e) => {
          e.preventDefault();
          editMode ? updateCar() : addCar();
        }}>
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="Matricule"
            readOnly={role === 'employee'}
            required
          />
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Marque"
            readOnly={role === 'employee'}
            required
          />
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Modèle"
            readOnly={role === 'employee'}
            required
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="under_review">En révision</option>
          </select>
          {role === 'admin' && (
            <>
              <input
                type="text"
                value={assignedEmployee}
                onChange={(e) => setAssignedEmployee(e.target.value)}
                placeholder="Employé"
                required
              />
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Client"
                required
              />
            </>
          )}
          <button type="submit">{editMode ? 'Modifier' : 'Ajouter'}</button>
        </form>
      </div>
    </div>
  );
};

export default CarManagementComponent;
