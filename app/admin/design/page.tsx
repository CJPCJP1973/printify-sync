'use client'

import Link from 'next/link'
import { useState } from 'react'

const products = ['Classic tee', 'Heavyweight hoodie', 'Embroidered cap', 'Canvas tote']

export default function ProductDesignPage() {
  const [product, setProduct] = useState(products[0])
  const [designName, setDesignName] = useState('')
  const [uploadedFile, setUploadedFile] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <main className="admin-shell design-shell">
      <header className="admin-header">
        <Link className="admin-brand" href="/admin">DH / Admin</Link>
        <span className="admin-badge">Product studio</span>
      </header>

      <div className="design-heading">
        <Link className="admin-back" href="/admin">← Back to God Mode</Link>
        <p className="admin-kicker">Printify product design</p>
        <h1>Make it<br /><em>hunt-ready.</em></h1>
        <p>Build a product concept, upload artwork, and prepare it for your Printify catalog.</p>
      </div>

      <form className="design-layout" onSubmit={handleSave}>
        <section className="design-preview" aria-label="Product preview">
          <div className="preview-label">Live preview</div>
          <div className="product-art" aria-hidden="true">
            <span>{designName || 'YOUR DESIGN'}</span>
          </div>
          <div className="preview-meta">
            <strong>{product}</strong>
            <span>{uploadedFile ? `Artwork: ${uploadedFile}` : 'No artwork uploaded yet'}</span>
          </div>
        </section>

        <section className="design-form" aria-label="Product details">
          <label>
            Product type
            <select value={product} onChange={(event) => setProduct(event.target.value)}>
              {products.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Design name
            <input value={designName} onChange={(event) => setDesignName(event.target.value)} placeholder="e.g. Trail Dog Supply" />
          </label>
          <label className="upload-field">
            Artwork file
            <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={(event) => setUploadedFile(event.target.files?.[0]?.name ?? '')} />
            <span>{uploadedFile || 'PNG, JPG, or SVG · recommended 3000 × 3000px'}</span>
          </label>
          <div className="design-actions">
            <button type="submit">Save product concept</button>
            {saved && <span role="status">Saved in this session.</span>}
          </div>
        </section>
      </form>

      <footer className="admin-footer">
        <span>God Mode · Product studio</span>
        <span>Printify connection ready</span>
      </footer>
    </main>
  )
}
