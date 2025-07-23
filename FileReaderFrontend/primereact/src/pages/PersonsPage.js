import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Toolbar } from 'primereact/toolbar';
import { personService } from '../services/personService';
import * as XLSX from 'xlsx';
import { useTheme } from '../context/ThemeContext';

const PersonsPage = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState(1);
  const [rows, setRows] = useState(10);
  const [first, setFirst] = useState(0);
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    avgAge: 0,
    domains: {}
  });

  const rowsPerPageOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 }
  ];

  useEffect(() => {
    loadPersons();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [persons]);

  const calculateStats = () => {
    if (!persons.length) {
      setStats({ total: 0, avgAge: 0, domains: {} });
      return;
    }

    const total = persons.length;
    const avgAge = persons.reduce((sum, p) => sum + (parseInt(p.age) || 0), 0) / total;
    
    const domains = {};
    persons.forEach(p => {
      if (p.email) {
        const domain = p.email.split('@')[1];
        domains[domain] = (domains[domain] || 0) + 1;
      }
    });

    setStats({ total, avgAge: Math.round(avgAge), domains });
  };

  const loadPersons = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const data = await personService.getAllPersons();
      setPersons(data);
      setMessage({ 
        severity: 'success', 
        text: `✅ ${data.length} kişi başarıyla yüklendi` 
      });
    } catch (error) {
      setMessage({ 
        severity: 'error', 
        text: `❌ ${error.response?.data || 'Kişiler yüklenemedi!'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadPersons();
    setRefreshing(false);
  };

  const exportToExcel = async () => {
    if (!persons.length) {
      setMessage({ severity: 'warn', text: '⚠️ Tabloda veri yok!' });
      return;
    }

    setExportLoading(true);
    
    try {
      // Seçili kayıtlar varsa sadece onları, yoksa hepsini export et
      const dataToExport = selectedPersons.length > 0 ? selectedPersons : persons;
      
      const ws = XLSX.utils.json_to_sheet(dataToExport.map(person => ({
        'ID': person.id,
        'İsim': person.name,
        'Email': person.email,
        'Yaş': person.age,
        'Kayıt Tarihi': new Date().toLocaleDateString('tr-TR')
      })));
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Kişiler');
      
      // Dosya adını tarih ile oluştur
      const fileName = `kisiler_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      setMessage({ 
        severity: 'success', 
        text: `📊 ${dataToExport.length} kayıt Excel'e aktarıldı` 
      });
    } catch (error) {
      setMessage({ 
        severity: 'error', 
        text: '❌ Excel export işlemi başarısız!' 
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Column templates
  const idBodyTemplate = (rowData) => {
    return <Badge value={rowData.id} severity="info" />;
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center">
        <i className="pi pi-user text-primary mr-2"></i>
        <span className="font-semibold">{rowData.name}</span>
      </div>
    );
  };

  const emailBodyTemplate = (rowData) => {
    const domain = rowData.email ? rowData.email.split('@')[1] : '';
    return (
      <div>
        <div className="font-medium">{rowData.email}</div>
        {domain && (
          <Tag value={domain} severity="secondary" className="mt-1" style={{fontSize: '0.7rem'}} />
        )}
      </div>
    );
  };

  const ageBodyTemplate = (rowData) => {
    const age = parseInt(rowData.age);
    let severity = 'info';
    if (age < 25) severity = 'success';
    else if (age < 40) severity = 'info';
    else if (age < 60) severity = 'warning';
    else severity = 'danger';

    return <Tag value={`${age} yaş`} severity={severity} />;
  };

  // Toolbar content
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap align-items-center gap-2">
        <Button
          label="Yenile"
          icon={refreshing ? "pi pi-spin pi-spinner" : "pi pi-refresh"}
          onClick={refreshData}
          className="p-button-outlined"
          loading={refreshing}
        />
        <Button
          label={selectedPersons.length > 0 ? `Seçilenleri Aktar (${selectedPersons.length})` : "Tümünü Aktar"}
          icon={exportLoading ? "pi pi-spin pi-spinner" : "pi pi-file-excel"}
          onClick={exportToExcel}
          className="p-button-success"
          disabled={!persons.length}
          loading={exportLoading}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex align-items-end " >
        <span className="p-input-icon-right">
          <i className="pi pi-spin pi-spinner" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Ara..."
            className="p-inputtext-sm"
          />
        </span>
        <Dropdown
          value={rows}
          options={rowsPerPageOptions}
          onChange={(e) => setRows(e.value)}
          className="w-6rem"
        />
      </div>
    );
  };

  // Statistics cards
  const renderStatsCards = () => {
    const topDomains = Object.entries(stats.domains)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return (
      <div className="grid mb-4">
        <div className="col-12 lg:col-3">
          <Card className="bg-blue-50 border-blue-200 h-full">
            <div className="flex align-items-center">
              <div className="bg-blue-500 text-white border-round p-3 mr-3">
                <i className="pi pi-users text-2xl"></i>
              </div>
              <div>
                <div className="text-blue-600 font-semibold text-sm">TOPLAM KİŞİ</div>
                <div className="text-2xl font-bold text-blue-800">{stats.total}</div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="col-12 lg:col-3">
          <Card className="bg-green-50 border-green-200 h-full">
            <div className="flex align-items-center">
              <div className="bg-green-500 text-white border-round p-3 mr-3">
                <i className="pi pi-calendar text-2xl"></i>
              </div>
              <div>
                <div className="text-green-600 font-semibold text-sm">ORTALAMA YAŞ</div>
                <div className="text-2xl font-bold text-green-800">{stats.avgAge}</div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="col-12 lg:col-3">
          <Card className="bg-orange-50 border-orange-200 h-full">
            <div className="flex align-items-center">
              <div className="bg-orange-500 text-white border-round p-3 mr-3">
                <i className="pi pi-check-square text-2xl"></i>
              </div>
              <div>
                <div className="text-orange-600 font-semibold text-sm">SEÇİLEN</div>
                <div className="text-2xl font-bold text-orange-800">{selectedPersons.length}</div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="col-12 lg:col-3">
          <Card className="bg-purple-50 border-purple-200 h-full">
            <div className="flex align-items-center">
              <div className="bg-purple-500 text-white border-round p-3 mr-3">
                <i className="pi pi-envelope text-2xl"></i>
              </div>
              <div>
                <div className="text-purple-600 font-semibold text-sm">TOP DOMAIN</div>
                <div className="text-lg font-bold text-purple-800">
                  {topDomains[0] ? topDomains[0][0] : 'N/A'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Card className="shadow-3">
          <div className="card-header mb-4">
            <div className="flex align-items-center justify-content-between">
              <div>
                <h2 className="text-2xl font-semibold text-900 m-0">
                  <i className="pi pi-users mr-2 text-primary"></i>
                  Kişi Yönetimi
                </h2>
                <p className="text-600 mt-1 mb-0">Kayıtlı kişileri görüntüleyin ve yönetin</p>
              </div>
              {!loading && (
                <Tag 
                  value={`${persons.length} kayıt`} 
                  severity="info" 
                  size="large"
                  className="font-semibold"
                />
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          {!loading && persons.length > 0 && renderStatsCards()}

          {/* Loading Progress */}
          {loading && (
            <div className="mb-4">
              <ProgressBar mode="indeterminate" style={{height: '6px'}} />
              <p className="text-center text-600 mt-2">
                <i className="pi pi-spin pi-spinner mr-2"></i>
                Veriler yükleniyor...
              </p>
            </div>
          )}

          {/* Messages */}
          {message && (
            <Message 
              severity={message.severity} 
              text={message.text}
              className="mb-4"
            />
          )}

          {/* Toolbar */}
          {!loading && (
            <>
              <Toolbar 
                className="mb-4 border-round" 
                left={leftToolbarTemplate} 
                right={rightToolbarTemplate}
              />
              
              <Divider className="my-3" />
            </>
          )}

          {/* Data Table */}
          <DataTable 
            value={persons} 
            loading={loading}
            paginator 
            rows={rows}
            first={first}
            onPage={(e) => setFirst(e.first)}
            totalRecords={persons.length}
            emptyMessage={
              <div className="text-center p-4">
                <i className="pi pi-users text-4xl text-400"></i>
                <p className="text-600 font-semibold mt-3">Henüz kayıtlı kişi bulunmuyor</p>
                <p className="text-500 text-sm">Dosya yükleme sayfasından yeni kişiler ekleyebilirsiniz</p>
              </div>
            }
            className="p-datatable-striped p-datatable-gridlines"
            showGridlines
            stripedRows
            responsiveLayout="scroll"
            selection={selectedPersons}
            onSelectionChange={(e) => setSelectedPersons(e.value)}
            dataKey="id"
            globalFilter={globalFilter}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(e) => {
              setSortField(e.sortField);
              setSortOrder(e.sortOrder);
            }}
            removableSort
            resizableColumns
            columnResizeMode="expand"
          >
            <Column 
              selectionMode="multiple" 
              headerStyle={{ width: '3rem' }}
              frozen
            />
            <Column 
              field="id" 
              header="ID" 
              sortable 
              style={{ minWidth: '4rem' }}
              body={idBodyTemplate}
              frozen
            />
            <Column 
              field="name" 
              header="İsim" 
              sortable 
              style={{ minWidth: '12rem' }}
              body={nameBodyTemplate}
            />
            <Column 
              field="email" 
              header="Email" 
              sortable 
              style={{ minWidth: '15rem' }}
              body={emailBodyTemplate}
            />
            <Column 
              field="age" 
              header="Yaş" 
              sortable 
              style={{ minWidth: '6rem' }}
              body={ageBodyTemplate}
            />
          </DataTable>

          {/* Selected Items Info */}
          {selectedPersons.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 border-round border-blue-200">
              <div className="flex align-items-center justify-content-between">
                <div className="flex align-items-center">
                  <i className="pi pi-info-circle text-blue-600 mr-2"></i>
                  <span className="text-blue-800 font-semibold">
                    {selectedPersons.length} kayıt seçildi
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    label="Seçilenleri Aktar"
                    icon="pi pi-file-excel"
                    onClick={exportToExcel}
                    className="p-button-sm p-button-success"
                    loading={exportLoading}
                  />
                  <Button
                    label="Seçimi Temizle"
                    icon="pi pi-times"
                    onClick={() => setSelectedPersons([])}
                    className="p-button-sm p-button-text"
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PersonsPage;