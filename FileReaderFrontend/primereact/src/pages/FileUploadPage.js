import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { fileService } from '../services/fileService';

const FileUploadPage = () => {
  const [fileType, setFileType] = useState('json');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const toast = useRef(null);

  const fileTypes = [
    { label: 'JSON Dosyası', value: 'json' },
    { label: 'XML Dosyası', value: 'xml' }
  ];

  const descriptions = {
    json: 'JSON formatı: [ { "name": "Ali", "email": "ali@mail.com", "age": 25 } ]',
    xml: 'XML formatı: <persons> <person><name>Ali</name><email>ali@mail.com</email><age>25</age></person> </persons>'
  };

  const onUpload = async () => {
    if (!files.length) {
      toast.current.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen en az bir dosya seçin!' });
      return;
    }
    setLoading(true);
    try {
      const result = await fileService.uploadFiles(files, fileType);
      toast.current.show({ severity: 'success', summary: 'Başarılı', detail: `${result.successCount} kayıt eklendi.` });
      if (result.errorList && result.errorList.length > 0) {
        result.errorList.forEach(error => {
          toast.current.show({ severity: 'error', summary: 'Hatalı Kayıt', detail: (error.messages || error.error), life: 7000 });
        });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Yükleme Hatası', detail: error.response?.data || 'Bilinmeyen hata' });
    } finally {
      setLoading(false);
    }
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
    setPreviewData([]);
    if (e.files && e.files.length > 0) {
      const allPreviews = [];
      let filesRead = 0;
      e.files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            let data = [];
            if (fileType === 'json') {
              data = JSON.parse(event.target.result);
            } else if (fileType === 'xml') {
              const parser = new window.DOMParser();
              const xml = parser.parseFromString(event.target.result, 'text/xml');
              data = Array.from(xml.getElementsByTagName('person')).map(person => ({
                name: person.getElementsByTagName('name')[0]?.textContent,
                email: person.getElementsByTagName('email')[0]?.textContent,
                age: person.getElementsByTagName('age')[0]?.textContent,
              }));
            }
            if (Array.isArray(data)) {
              
              allPreviews.push(...data);
            } else {
              allPreviews.push(data);
            }
          } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Önizleme Hatası', detail: `${file.name} okunamadı.` });
          }
          filesRead++;
          if (filesRead === e.files.length) {
            setPreviewData(allPreviews.slice(0, 10));
          }
        };
        reader.readAsText(file);
      });
    }
  };

  return (
    <div className="grid">
      <Toast ref={toast} position="top-right" />
      <div className="col-12">
        <Card className="shadow-3">
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="fileType" className="font-semibold text-900 mb-2 block">
                <i className="pi pi-cog mr-2"></i>Dosya Türü
              </label>
              <Dropdown
                id="fileType"
                value={fileType}
                options={fileTypes}
                onChange={(e) => setFileType(e.value)}
                placeholder="Dosya türü seçin"
                className="p-dropdown-lg"
              />
            </div>
            <Panel className="mb-4 bg-blue-50 border-blue-200">
              <div className="flex align-items-center">
                <i className="pi pi-info-circle text-blue-600 mr-2"></i>
                <span className="text-blue-800 font-medium">Format Bilgisi:</span>
              </div>
              <div className="text-blue-700 mt-2 font-mono text-sm">
                {descriptions[fileType]}
              </div>
            </Panel>
            <div className="field">
              <label className="font-semibold text-900 mb-2 block">
                <i className="pi pi-upload mr-2"></i>Dosya Seçimi
              </label>
              <FileUpload
                mode="basic"
                name="files"
                multiple
                accept={fileType === 'json' ? '.json' : '.xml'}
                maxFileSize={10000000}
                onSelect={onFileSelect}
                auto={false}
                chooseLabel="Dosya Seç"
              />
            </div>
            {/* Seçilen dosyaların kartlı ve yatay listesi */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3 mt-2">
                {files.map((file, idx) => (
                  <div key={idx} className="surface-50 border-round p-3 border-1 border-200 flex align-items-center gap-2" style={{minWidth: '220px', maxWidth: '300px'}}>
                    <i className="pi pi-file text-2xl text-primary mr-2" />
                    <div className="flex flex-column flex-1">
                      <span className="font-semibold text-900" style={{wordBreak: 'break-all'}}>{file.name}</span>
                      <span className="text-600 text-xs">{(file.size/1024).toFixed(1)} KB</span>
                    </div>
                    <Button icon="pi pi-times" className="p-button-rounded p-button-text p-button-danger p-button-sm ml-2" onClick={() => {
                      const updated = files.filter((_, i) => i !== idx);
                      setFiles(updated);
                      if (updated.length === 0) setPreviewData([]);
                    }} tooltip="Kaldır" tooltipOptions={{position: 'left'}} />
                  </div>
                ))}
              </div>
            )}
            {previewData.length > 0 && (
              <Panel className="mb-4 mt-4">
                <div className="flex align-items-center mb-3">
                  <i className="pi pi-eye text-lg mr-2 text-primary"></i>
                  <span className="font-semibold text-900 text-lg">Veri Önizlemesi</span>
                </div>
                <DataTable
                  value={previewData}
                  rows={5}
                  paginator
                  className="p-datatable-sm"
                  stripedRows
                  showGridlines
                  responsiveLayout="scroll"
                >
                  <Column field="name" header="İsim" className="font-semibold" />
                  <Column field="email" header="Email" />
                  <Column field="age" header="Yaş" />
                </DataTable>
              </Panel>
            )}
            <div className="text-center mb-4">
              <Button
                label={loading ? "Yükleniyor..." : "Dosyaları Yükle"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-cloud-upload"}
                onClick={onUpload}
                loading={loading}
                disabled={!files.length}
                size="large"
                className="p-button-success px-6 py-3 font-semibold"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FileUploadPage;