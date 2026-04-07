import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadInvoice } from '../api/client';

export default function UploadInvoice() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setUploading(true);
        setProgress(0);
        setError(null);
        setResult(null);

        // Simulate progress for UX
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 85) {
                    clearInterval(progressInterval);
                    return 85;
                }
                return prev + Math.random() * 15;
            });
        }, 300);

        try {
            const data = await uploadInvoice(file);
            clearInterval(progressInterval);
            setProgress(100);
            setResult(data);
        } catch (err) {
            clearInterval(progressInterval);
            setError(err.response?.data?.detail || 'Upload failed. Please try again.');
            setProgress(0);
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'],
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    const reset = () => {
        setResult(null);
        setError(null);
        setProgress(0);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-eyebrow">No Manual Re-Entry</div>
                    <div className="page-title">OCR Imports</div>
                </div>
            </div>

            <div className="grid2">
                {/* Upload Zone */}
                <div className="card">
                    <div className="card-title">Import Tray</div>
                    <div className="card-heading" style={{ marginBottom: '14px' }}>Drop files or photos here</div>
                    <div
                        {...getRootProps()}
                        className={`upload-zone ${isDragActive ? 'drag' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <div className="upload-icon">📄</div>
                        {isDragActive ? (
                            <>
                                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '6px' }}>Drop your file here!</div>
                                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Release to start OCR extraction</div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', marginBottom: '6px' }}>Paper bills, PDFs, Excel sheets</div>
                                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Drag, tap, or scan with mobile camera</div>
                            </>
                        )}
                        <div className="upload-formats">
                            <span className="format-badge">PNG</span>
                            <span className="format-badge">JPG</span>
                            <span className="format-badge">PDF</span>
                            <span className="format-badge">WebP</span>
                            <span className="format-badge">TIFF</span>
                        </div>
                    </div>

                    {/* Progress */}
                    {(uploading || progress > 0) && progress < 100 && (
                         <div style={{ marginTop: '14px' }}>
                             <div className="profit-bar-row">
                                 <div className="profit-bar-label">{uploading ? '🔍 Running OCR extraction...' : 'Processing...'}</div>
                                 <div className="profit-bar-bg"><div className="profit-bar-fill" style={{ width: `${progress}%`, background: 'var(--gold)' }}></div></div>
                                 <div className="profit-bar-pct">{Math.round(progress)}%</div>
                             </div>
                         </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="alert alert-red" style={{ marginTop: '14px' }}>
                            <span className="alert-icon">⚠</span>
                            <span>{error}</span>
                            <button className="btn btn-ghost" onClick={reset} style={{ padding: '2px 8px', marginLeft: 'auto' }}>Try Again</button>
                        </div>
                    )}
                </div>

                {/* Extraction Preview */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                            <div className="card-title" style={{ margin: 0 }}>Extraction Preview</div>
                            <div className="card-heading" style={{ fontSize: '16px', marginTop: '4px' }}>
                                {result ? `Mapped ${result.filename}` : 'Waiting for file...'}
                            </div>
                        </div>
                        {result && <div className="ocr-conf">◉ 92% confidence</div>}
                    </div>

                    {result ? (
                        <>
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Supplier</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.products?.map((product, idx) => (
                                            <tr key={idx}>
                                                <td style={{ color: 'var(--text)' }}>{product.product_name}</td>
                                                <td>{product.quantity}</td>
                                                <td>₹{product.price}</td>
                                                <td>{product.supplier || 'Unknown'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <details style={{ marginTop: '24px' }}>
                                <summary style={{ cursor: 'pointer', color: 'var(--text3)', fontSize: '12px', padding: '8px 0' }}>
                                    View raw OCR text
                                </summary>
                                <pre style={{
                                    marginTop: '8px',
                                    padding: '16px',
                                    background: 'var(--navy3)',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    color: 'var(--text2)',
                                    whiteSpace: 'pre-wrap',
                                    maxHeight: '300px',
                                    overflow: 'auto',
                                    border: '1px solid var(--border2)',
                                    fontFamily: 'var(--font-mono)'
                                }}>
                                    {result.raw_text}
                                </pre>
                            </details>

                            <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                                <button className="btn btn-gold" style={{ flex: 1 }} onClick={reset}>Accept All & Import Next</button>
                                <button className="btn btn-ghost" onClick={reset}>Reject</button>
                            </div>

                            <div className="divider"></div>
                            <div className="card-title">Processing Stats</div>
                            <div className="stat-row"><span className="stat-key">Items extracted</span><span className="stat-val">{result.products_extracted}</span></div>
                            <div className="stat-row"><span className="stat-key">Auto-matched</span><span className="stat-val" style={{ color: 'var(--green)' }}>{result.products_extracted}</span></div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '40px 20px', fontSize: '12px' }}>
                            Upload an invoice to see the extracted data here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
