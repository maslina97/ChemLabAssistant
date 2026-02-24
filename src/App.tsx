/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Calculator } from './components/Calculator';
import { Inventory } from './components/Inventory';
import { LabWorks } from './components/LabWorks';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'calculator' && <Calculator />}
      {activeTab === 'inventory' && <Inventory />}
      {activeTab === 'labworks' && <LabWorks />}
    </Layout>
  );
}
