# Compound Research Knowledge Platform

A full-stack research knowledge management platform designed to organize compound information, biological targets, research documents, and AI-assisted scientific exploration in a centralized system.

The platform combines traditional CRUD-based research management with **Retrieval-Augmented Generation (RAG)** to allow researchers to ask questions about compounds and receive AI-generated answers grounded in indexed research documents.

---

## 📌 Overview

The **Compound Research Knowledge Platform** provides a centralized environment for managing scientific compound information and associated research evidence.

Researchers can:

- Create and manage compound records
- Associate compounds with biological targets
- Classify compounds into categories
- Upload research papers, notes, and reference documents
- Extract and index document text into searchable chunks
- Perform semantic/vector-based retrieval
- Ask an AI research assistant questions about compounds
- View the supporting research context used by the AI
- Manage users and role-based permissions

The system is designed around the idea of combining a structured research database with an AI-powered knowledge retrieval layer.

---

## ✨ Key Features

### 🧪 Compound Management

The platform provides complete compound record management.

Each compound can contain:

- Compound name
- Molecular formula
- Synonyms / trade names
- Scientific description
- Category
- Biological targets
- Associated research documents

Supported operations include:

- Add compound
- View compound details
- Edit compound
- Delete compound
- Search and browse compounds
- Associate biological targets
- Assign compound categories

---

### 🎯 Biological Target Management

Compounds can be associated with one or more biological targets.

This allows researchers to establish relationships such as:

```text
Compound
   │
   ├── Target A
   ├── Target B
   └── Target C
