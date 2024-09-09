import React from 'react';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerFormModal';
import useAutoLogout from '../hooks/useAutoLogout';

const Customers: React.FC = () => {
    useAutoLogout();
    return (
        <div className= "Customers" >
        <CustomerForm />
        < CustomerList />
        </div>
  );
};

export default Customers;
