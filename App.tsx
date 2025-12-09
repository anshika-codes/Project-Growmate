import React, { useState } from 'react';
import { Plant, PlantType } from './types';
import Dashboard from './components/Dashboard';
import PlantDetail from './components/PlantDetail';
import AddPlantForm from './components/AddPlantForm';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import Signup from './components/Signup';
import BottomNav from './components/BottomNav';
import UserInfo from './components/UserInfo';
import Encyclopaedia from './components/Encyclopaedia';
import Reels from './components/Reels';
import { LeafIcon } from './components/Icons';

// Mock initial data
const initialPlants: Plant[] = [
    {
        id: '1',
        name: 'Rosie',
        species: 'Rosa',
        plantType: PlantType.Flowering,
        age: 6,
        leaves: 32,
        buds: 5,
        flowers: 2,
        photoBase64: 'https://picsum.photos/seed/rosie/400/400',
        lastWatered: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    },
    {
        id: '2',
        name: 'Spike',
        species: 'Echinocactus grusonii',
        plantType: PlantType.Succulent,
        age: 12,
        leaves: 0,
        buds: 0,
        flowers: 0,
        photoBase64: 'https://picsum.photos/seed/spike/400/400',
        lastWatered: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], // A week ago
    }
];

type MainView = 'dashboard' | 'add' | 'encyclopaedia' | 'reels' | 'user';
type AuthView = 'login' | 'signup';

const App: React.FC = () => {
    const [plants, setPlants] = useState<Plant[]>(initialPlants);
    const [plantToEdit, setPlantToEdit] = useState<Plant | null>(null);
    
    // View management
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authView, setAuthView] = useState<AuthView>('login');
    const [mainView, setMainView] = useState<MainView>('dashboard');
    
    // Dashboard can show list or detail
    const [dashboardView, setDashboardView] = useState<'list' | 'detail'>('list');
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [plantToDelete, setPlantToDelete] = useState<Plant | null>(null);


    const handleSelectPlant = (plant: Plant) => {
        setSelectedPlant(plant);
        setDashboardView('detail');
    };

    const handleBackToDashboardList = () => {
        setSelectedPlant(null);
        setDashboardView('list');
    };
    
    const handleNavigate = (view: MainView) => {
        setMainView(view);
        if (view !== 'dashboard') {
            handleBackToDashboardList();
        }
        if (view === 'add') {
            setPlantToEdit(null);
        }
    }
    
    const handleEditPlant = (plant: Plant) => {
        setPlantToEdit(plant);
        setMainView('add');
    };

    const handleSavePlant = (plant: Plant) => {
        const index = plants.findIndex(p => p.id === plant.id);
        if (index !== -1) {
            const updatedPlants = [...plants];
            updatedPlants[index] = plant;
            setPlants(updatedPlants);
        } else {
            setPlants([...plants, plant]);
        }
        setPlantToEdit(null);
        handleNavigate('dashboard');
    };

    const handleDeleteRequest = (plant: Plant) => {
        setPlantToDelete(plant);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (plantToDelete) {
            setPlants(plants.filter(p => p.id !== plantToDelete.id));
            handleBackToDashboardList();
        }
        setShowDeleteConfirm(false);
        setPlantToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setPlantToDelete(null);
    };

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);
    
    const renderMainView = () => {
        if (mainView === 'dashboard') {
            if (dashboardView === 'list') {
                return <Dashboard plants={plants} onSelectPlant={handleSelectPlant} onAddPlant={() => handleNavigate('add')} />;
            }
            if (dashboardView === 'detail' && selectedPlant) {
                return <PlantDetail plant={selectedPlant} onBack={handleBackToDashboardList} onEdit={() => handleEditPlant(selectedPlant)} onDelete={() => handleDeleteRequest(selectedPlant)} />;
            }
        }
        if (mainView === 'add') {
            return <AddPlantForm onCancel={() => handleNavigate('dashboard')} onSave={handleSavePlant} plantToEdit={plantToEdit} />;
        }
        if (mainView === 'encyclopaedia') {
            return <Encyclopaedia />;
        }
        if (mainView === 'reels') {
            return <Reels />;
        }
        if (mainView === 'user') {
            return <UserInfo onLogout={handleLogout} />;
        }
        return null;
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-brand-light-green flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <LeafIcon className="w-16 h-16 text-brand-green mx-auto" />
                        <h1 className="text-4xl font-bold text-brand-green mt-2">Welcome to GrowMate</h1>
                    </div>
                    {authView === 'login' ? (
                        <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
                    ) : (
                        <Signup onSignup={handleLogin} onSwitchToLogin={() => setAuthView('login')} />
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-brand-cream text-gray-800 font-sans pb-20">
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                        <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to delete "{plantToDelete?.name}"? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-center items-center relative">
                    <div className="flex items-center space-x-2">
                         <LeafIcon className="w-8 h-8 text-brand-green" />
                        <h1 className="text-2xl font-bold text-brand-green">GrowMate</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto">
                {renderMainView()}
            </main>

            <Chatbot />
            <BottomNav activeView={mainView} onNavigate={handleNavigate} />
        </div>
    );
};

export default App;