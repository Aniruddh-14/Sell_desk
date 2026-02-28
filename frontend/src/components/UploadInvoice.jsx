import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle, FileText, AlertCircle } from 'lucide-react';
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
                <h2>📄 Upload Invoice</h2>
                <p>Upload an invoice or receipt to extract product data via AI-powered OCR</p>
            </div>

            {/* Upload Zone */}
            <div className="glass-card animate-in">
                <div
                    {...getRootProps()}
                    className={`upload-zone ${isDragActive ? 'active' : ''}`}
                    id="upload-dropzone"
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="upload-icon" />
                    {isDragActive ? (
                        <>
                            <h3>Drop your file here!</h3>
                            <p>Release to start OCR extraction</p>
                        </>
                    ) : (
                        <>
                            <h3>Drag & drop your invoice here</h3>
                            <p>or click to browse files</p>
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
                    <div className="upload-progress">
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="progress-text">
                            <span>{uploading ? '🔍 Running OCR extraction...' : 'Processing...'}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: 12, border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <AlertCircle size={20} color="#f43f5e" />
                        <span style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{error}</span>
                        <button className="btn btn-secondary" onClick={reset} style={{ marginLeft: 'auto' }}>Try Again</button>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="extracted-data">
                        <h3>
                            <CheckCircle size={22} className="check-icon" />
                            Extracted {result.products_extracted} products from {result.filename}
                        </h3>

                        <div className="product-grid">
                            {result.products?.map((product, idx) => (
                                <div key={idx} className="product-card-mini animate-in">
                                    <div className="product-info">
                                        <h4>{product.product_name}</h4>
                                        <p>Qty: {product.quantity} • {product.supplier || 'Unknown'}</p>
                                    </div>
                                    <div className="product-price">₹{product.price}</div>
                                </div>
                            ))}
                        </div>

                        {/* Raw OCR Text */}
                        <details style={{ marginTop: 24 }}>
                            <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '8px 0' }}>
                                View raw OCR text
                            </summary>
                            <pre style={{
                                marginTop: 8,
                                padding: 16,
                                background: 'var(--bg-glass)',
                                borderRadius: 8,
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                whiteSpace: 'pre-wrap',
                                maxHeight: 300,
                                overflow: 'auto',
                                border: '1px solid var(--border-glass)',
                            }}>
                                {result.raw_text}
                            </pre>
                        </details>

                        <div style={{ marginTop: 20 }}>
                            <button className="btn btn-primary" onClick={reset}>
                                <UploadCloud size={16} />
                                Upload Another Invoice
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
