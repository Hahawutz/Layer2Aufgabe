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

const getRoleFromLocalStorage = () => {
    return localStorage.getItem('role');
};
const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [expandedCustomerId, setExpandedCustomerId] = useState<number | null>(null);

    const username = localStorage.getItem('username');

    const getToken = () => localStorage.getItem('token');
    const role = getRoleFromLocalStorage();
    const fetchCustomers = async () => {
        try {
            const token = getToken();
            const response = await fetch('https://localhost:7073/api/Customer', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error when retrieving the customer list');
            }
            const data: Customer[] = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error when retrieving the customer list:', error);
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
            const token = getToken();
            const response = await fetch('https://localhost:7073/api/Customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newCustomer),
            });

            if (!response.ok) {
                throw new Error(`Error when adding the customer: ${response.statusText}`);
            }

            await fetchCustomers();
        } catch (error) {
            console.error('Error when adding the customer:', error);
        }
    };

    const updateCustomer = async (updatedCustomer: Customer) => {
        try {
            const token = getToken();
            const response = await fetch(`https://localhost:7073/api/Customer/${updatedCustomer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedCustomer),
            });

            if (!response.ok) {
                throw new Error(`Error when updating the customer: ${response.statusText}`);
            }

            await fetchCustomers();
        } catch (error) {
            console.error('Error when updating the customer:', error);
        }
    };

    const deleteCustomer = async (customerId: number) => {
        try {
            const token = getToken();
            const response = await fetch(`https://localhost:7073/api/Customer/${customerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error when deleting the customer: ${response.statusText}`);
            }

            await fetchCustomers();
        } catch (error) {
            console.error('Error when deleting the customer:', error);
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
                <h2>Customer list</h2>
                {username && <p>Logged in as: {role}</p>}
                {role !== 'Read' && (
                    <button
                        className="btn btn-success"
                        onClick={() => handleShowModal()}
                    >
                        Add customer
                    </button>
                )}
            </div>
            <ul className="list-group">
                {customers.map((customer) => (
                    <li key={customer.id} className="list-group-item d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Id: {customer.id}</strong><br />
                                <strong>{customer.name}</strong> ({customer.code})<br />
                                Responsible: {customer.responsiblePerson}<br />
                                Customer since: {new Date(customer.startDate).toLocaleDateString()} 
                            </div>
                            <div>
                                {role !== 'Read' && (
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleShowModal(customer)}
                                    >
                                        Edit
                                    </button>
                                )}
                                {role === 'Admin' && (
                                    <button
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={() => deleteCustomer(customer.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                                {customer.projects.length > 0 && (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => toggleProjects(customer.id)}
                                    >
                                        {expandedCustomerId === customer.id ? 'Hide project' : 'Show project'}
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
                                        End: {new Date(project.endDate).toLocaleDateString()}
                                        <br />
                                        Responsible: {project.responsiblePerson}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

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
