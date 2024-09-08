import React from 'react';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerFormModal';

const Customers: React.FC = () => {
    return (
        <div className= "Customers" >
        <CustomerForm />
        < CustomerList />
        </div>
  );
};

export default Customers;
