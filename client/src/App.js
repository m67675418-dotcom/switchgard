import './App.css';
import AddDoctor from './Doctor/AddDoctor'
import ManageDoctor from './Doctor/ManageDoctor';

import AddNurse from './Nurse/AddNurse';
import ManageNurse from './Nurse/ManageNurse';

import AddFireFighter from './FireFighter/AddFireFighter';
import ManageFireFighter from './FireFighter/ManageFireFighter';

import AddGarde from './garde/AddGarde';
import ManageGarde from './garde/ManageGarde';

import AddMessage from './message/AddMessage'; 
import ManageMessage from './message/ManageMessage';

import AddPharmacist from './pharmacist/AddPharmacist';
import ManagePharmacist from './pharmacist/ManagePharmacist';

import AddTransaction from './transaction/AddTransaction';
import ManageTransactions from './transaction/ManageTransactions';

import SendEmail from './Email/SendEmail';

import createAccount from './createAccount/createAccount';

function App() {
  return (
    <div className="App">
      <AddDoctor />
      <ManageDoctor/>
      
      <AddNurse />
      <ManageNurse/>
     

      <AddFireFighter />
      <ManageFireFighter/>
      

      <AddGarde />
      <ManageGarde/>

      <AddMessage /> 
      <ManageMessage/>
      

      <AddPharmacist/>
      <ManagePharmacist/>

      <AddTransaction/>
      <ManageTransactions/>

      <SendEmail/>
      <createAccount/>
    </div>
  );
}

export default App;