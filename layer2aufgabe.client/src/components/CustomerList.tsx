import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomerFormModal from './CustomerFormModal';

interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    responsiblePerson: string;
}

interface Customer {
    id: number;
    name: string;
    code: string;
    responsiblePerson: string;
    startDate: string;
    projects: Project[];
}

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [expandedCustomerId, setExpandedCustomerId] = useState<number | null>(null);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('https://localhost:7073/api/Customer');
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Kundenliste');
            }
            const data: Customer[] = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Fehler beim Laden der Kunden:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (customer: Customer | null = null) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const addCustomer = async (newCustomer: Omit<Customer, 'id'>) => {
        try {
            const response = await fetch('https://localhost:7073/api/Customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomer),
            });

            if (!response.ok) {
                throw new Error(`Fehler beim Hinzuf&#252;gen des Kunden: ${response.statusText}`);
            }

            await fetchCustomers();
        } catch (error) {
            console.error('Fehler beim Hinzuf&#252;gen des Kunden:', error);
        }
    };

    const updateCustomer = async (updatedCustomer: Customer) => {
        try {
            const response = await fetch(`https://localhost:7073/api/Customer/${updatedCustomer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCustomer),
            });

            if (!response.ok) {
                throw new Error(`Fehler beim Aktualisieren des Kunden: ${response.statusText}`);
            }

            await fetchCustomers();
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Kunden:', error);
        }
    };

    const deleteCustomer = async (customerId: number) => {
        try {
            const response = await fetch(`https://localhost:7073/api/Customer/${customerId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Fehler beim L&#246;schen des Kunden: ${response.statusText}`);
            }

            await fetchCustomers();
        } catch (error) {
            console.error('Fehler beim L&#246;schen des Kunden:', error);
        }
    };

    const handleSubmit = async (customer: Customer) => {
        if (customer.id) {
            await updateCustomer(customer);
        } else {
            await addCustomer(customer);
        }
        handleCloseModal();
    };

    const toggleProjects = (customerId: number) => {
        setExpandedCustomerId(expandedCustomerId === customerId ? null : customerId);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Kundenliste</h2>
            <button
                className="btn btn-success"
                onClick={() => handleShowModal()}
            >
                Kunde hinzuf&#252;gen
                </button>
            </div>
            <ul className="list-group">
                {customers.map((customer) => (
                    <li key={customer.id} className="list-group-item d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{customer.name}</strong> ({customer.code})<br />
                                Verantwortlicher: {customer.responsiblePerson}<br />
                                Kunde seit: {new Date(customer.startDate).toLocaleDateString()} {}
                            </div>
                            <div>
                                {role !== 'Read' && (
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleShowModal(customer)}
                                >
                                    Bearbeiten
                                </button>
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => deleteCustomer(customer.id)} 
                                >
                                    L&#246;schen
                                </button>
                                {customer.projects.length > 0 && (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => toggleProjects(customer.id)}
                                    >
                                        {expandedCustomerId === customer.id ? 'Projekte verbergen' : 'Projekte anzeigen'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {expandedCustomerId === customer.id && customer.projects.length > 0 && (
                            <ul className="list-group mt-3">
                                {customer.projects.map((project) => (
                                    <li key={project.id} className="list-group-item">
                                        <strong>{project.name}</strong>: {project.description}
                                        <br />
                                        Start: {new Date(project.startDate).toLocaleDateString()} -
                                        Ende: {new Date(project.endDate).toLocaleDateString()}
                                        <br />
                                        Verantwortlich: {project.responsiblePerson}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            {}
            <CustomerFormModal
                show={showModal}
                handleClose={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={selectedCustomer || {}}
            />
        </div>
    );
};

export default CustomerList;
