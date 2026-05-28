import { useState, useEffect } from 'react';
import { RefreshCw, FileText, DownloadCloud, Copy, ExternalLink, Calendar, CheckCircle2, Settings2, Code2, AlertCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface SyncData {
  id: string;
  name: string;
  phone: string;
  address: string;
  quantity: number;
  date: string;
  status: 'Pesanan Baru' | 'Diproses';
  [key: string]: any;
}

const initialMockData: SyncData[] = [];

const scriptCode = `// 1. Buka formulir Anda (di tab baru)
// 2. Klik ikon "More" (titik 3) di kanan atas -> "Script editor"
// 3. Paste kode di bawah ini menimpa semua kode yang ada
// 4. Klik tombol "Deploy" biru di kanan atas -> "New deployment"
// 5. Pilih tipe "Web App" (klik icon gir/gear)
// 6. Who has access: "Anyone"
// 7. Simpan, authorize, lalu SALIN "Web App URL" dan paste di Dashboard Anda.

function doGet(e) {
  var formId = "12AqrqRdkroza_oQtvirYm-QA5z8FA4FyQABaW3Bc-Y8"; // ID form sesuai URL Anda
  var form = FormApp.openById(formId);
  var responses = form.getResponses();
  
  var data = [];
  var start = Math.max(0, responses.length - 100);
  
  for (var i = start; i < responses.length; i++) {
    var response = responses[i];
    var itemResponses = response.getItemResponses();
    
    var timeDate = new Date(response.getTimestamp().getTime() + (7 * 60 * 60 * 1000));
    var dateString = timeDate.toISOString().replace('T', ' ').substring(0, 16);
    
    var row = {
      id: "ORD-" + ("000" + (i + 1)).slice(-4),
      date: dateString,
      status: 'Pesanan Baru'
    };
    
    for (var j = 0; j < itemResponses.length; j++) {
      var title = itemResponses[j].getItem().getTitle().toLowerCase();
      var answer = itemResponses[j].getResponse();
      
      if (title.includes("nama")) row.name = answer;
      else if (title.includes("telepon") || title.includes("wa")) row.phone = answer;
      else if (title.includes("alamat")) row.address = answer;
      else if (title.includes("jumlah") || title.includes("qty")) row.quantity = answer;
    }
    
    if (!row.name) row.name = "Tanpa Nama";
    if (!row.phone) row.phone = "-";
    if (!row.address) row.address = "-";
    if (!row.quantity) row.quantity = 1;
    
    data.push(row);
  }
  
  return ContentService.createTextOutput(JSON.stringify(data.reverse()))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export default function DataTarik() {
  const [activeTab, setActiveTab] = useState<'tabel' | 'form'>('tabel');
  const [isSyncing, setIsSyncing] = useState(false);
  const [data, setData] = useState<SyncData[]>(initialMockData);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [errorMsg, setErrorMsg] = useState('');
  const [appScriptUrl, setAppScriptUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('dakkari_api_url');
    if (saved) setAppScriptUrl(saved);
  }, []);

  const iframeUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdJWVv6KjDYkILOI3kVfQndxjLqMX8cKD7w1Z8WhaLx8aTk5g/viewform?embedded=true";

  const handleSync = async () => {
    setIsSyncing(true);
    setErrorMsg('');
    
    if (appScriptUrl.trim()) {
      try {
        localStorage.setItem('dakkari_api_url', appScriptUrl.trim());
        const response = await fetch(appScriptUrl.trim());
        if (!response.ok) throw new Error('Jaringan gagal merespon.');
        
        const result = await response.json();
        
        if (Array.isArray(result)) {
          setData(result);
        } else {
          throw new Error('Format data tidak valid.');
        }
      } catch (err: any) {
        setErrorMsg('Gagal menyinkronkan data: ' + err.message);
      }
    } else {
      setErrorMsg('Masukkan URL API Apps Script / CSV terlebih dahulu.');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setLastSync(new Date().toLocaleTimeString());
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sinkronisasi Data Formulir</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl hidden md:block">
            Tarik data respon pelanggan yang disubmit dari Google Form. Terhubung via Apps Script.
          </p>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex p-1 bg-slate-200/50 rounded-xl w-full flex-wrap font-medium text-sm text-slate-600 mb-6 gap-1 md:w-fit">
        <button
          onClick={() => setActiveTab('tabel')}
          className={cn(
            "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg transition-all",
            activeTab === 'tabel' ? "bg-white text-indigo-700 shadow-sm" : "hover:text-slate-800"
          )}
        >
          <DownloadCloud className="w-4 h-4" />
          Tabel Respon
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={cn(
            "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg transition-all",
            activeTab === 'form' ? "bg-white text-indigo-700 shadow-sm" : "hover:text-slate-800"
          )}
        >
          <FileText className="w-4 h-4" />
          Live Form
        </button>
      </div>

      {errorMsg && activeTab === 'tabel' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </motion.div>
      )}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'tabel' && (
          <motion.div
            key="tabel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* API Connection Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 md:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                        <h3 className="font-bold text-indigo-900 mb-1 flex items-center gap-2">
                            <Settings2 className="w-5 h-5" /> 
                            Koneksi Web Google Forms
                        </h3>
                        <p className="text-sm text-indigo-700 max-w-2xl">
                            Tarik data dari form respons (<span className="font-mono text-xs font-semibold bg-indigo-100 px-1 py-0.5 rounded">12Aqrq...</span>). 
                            Masukkan Web App URL (Apps Script) Anda di bawah ini dan tekan tarik data.
                        </p>
                    </div>
                    <button onClick={() => alert(scriptCode)} className="text-xs font-bold px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg flex items-center gap-2 transition-colors shrink-0">
                         <Code2 className="w-4 h-4" /> Lihat Kode Script (Copy)
                    </button>
                </div>
                <div className="mt-4 flex max-w-xl">
                   <input 
                      type="text" 
                      value={appScriptUrl}
                      onChange={(e) => setAppScriptUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/..."
                      className="flex-1 px-4 py-2 bg-white border border-indigo-200 text-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium text-sm"
                    />
                </div>
            </div>

            {/* Sync Controls */}
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-slate-600 text-sm font-medium w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Update Terakhir</p>
                  <p className="text-slate-800 font-bold">{lastSync}</p>
                </div>
              </div>

              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <RefreshCw className={cn("w-5 h-5", isSyncing && "animate-spin")} />
                {isSyncing ? "Menarik Data..." : "Tarik Data Terbaru"}
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-bold text-slate-800">Daftar Responden</h3>
                <div className="bg-slate-100 text-slate-600 text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-slate-400" />
                   Tampilan Mock (Data Kosong)
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider block min-w-[200px]">Alamat</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {data.map((row) => (
                        <motion.tr 
                          key={row.id}
                          initial={{ opacity: 0, backgroundColor: '#f1f5f9' }}
                          animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">{row.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold uppercase">
                                {typeof row.name === 'string' ? row.name.charAt(0) : '?'}
                              </div>
                              <div className="flex flex-col">
                                <span>{row.name}</span>
                                <span className="text-xs text-slate-400 font-normal">{row.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">{row.address}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.quantity}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{row.date}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap",
                              row.status === 'Pesanan Baru' ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                            )}>
                              {row.status || 'Pesanan Baru'}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                      {data.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                            Tidak ada data balasan ditemukan.
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[800px] relative flex flex-col"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  Pratinjau Formulir
               </div>
               <a 
                 href="https://docs.google.com/forms/d/e/1FAIpQLSdJWVv6KjDYkILOI3kVfQndxjLqMX8cKD7w1Z8WhaLx8aTk5g/viewform"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
               >
                 Buka di Tab Baru <ArrowUpRight className="w-3 h-3" />
               </a>
            </div>
            <div className="relative flex-1 w-full bg-slate-50 overflow-hidden">
               {/* Embed Google Form via iframe */}
               <iframe 
                 src={iframeUrl} 
                 className="w-full h-full border-0 absolute inset-0"
                 title="Google Form Toko Dakkari"
               >
                 Loading...
               </iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// We need ArrowUpRight icon inside this file since we are using it
export function ArrowUpRight({ className }: { className?: string; }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
    </svg>
  );
}

