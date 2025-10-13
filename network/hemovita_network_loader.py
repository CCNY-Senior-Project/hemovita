
from __future__ import annotations
from pathlib import Path
import pandas as pd

try:
    import networkx as nx
except Exception as e:
    nx = None

REQUIRED_EDGE_COLS = {"source", "target", "effect", "confidence", "notes"}

def load_edges_csv(edges_path: Path) -> pd.DataFrame:
    edges = pd.read_csv(edges_path)
    missing = REQUIRED_EDGE_COLS - set(edges.columns)
    if missing:
        raise ValueError(f"Edge CSV missing columns: {missing}. Found: {list(edges.columns)}")
    edges["source"] = edges["source"].astype(str).str.strip()
    edges["target"] = edges["target"].astype(str).str.strip()
    edges["effect"] = edges["effect"].astype(str).str.strip().str.lower()
    edges["confidence"] = edges["confidence"].astype(str).str.strip()
    edges["notes"] = edges["notes"].astype(str).fillna("").str.strip()
    return edges

def list_sheet_names(xlsx_path: Path) -> list[str]:
    xls = pd.ExcelFile(xlsx_path)
    return list(xls.sheet_names)

def validate_node_alignment(sheet_names: list[str], edges: pd.DataFrame) -> dict:
    sheet_set = set(sheet_names)
    node_set = set(edges["source"]).union(edges["target"])
    unknown_nodes = sorted(node_set - sheet_set)
    sheets_without_edges = sorted(sheet_set - node_set)
    return {
        "unknown_nodes": unknown_nodes,
        "sheets_without_edges": sheets_without_edges,
        "node_count": len(node_set),
        "sheet_count": len(sheet_set),
    }

def build_graph(edges: pd.DataFrame):
    if nx is None:
        raise ImportError(
            "networkx is required to build the graph. Please install it: pip install networkx"
        )
    G = nx.DiGraph()
    for n in set(edges["source"]).union(edges["target"]):
        G.add_node(n)
    for _, r in edges.iterrows():
        G.add_edge(
            r["source"],
            r["target"],
            effect=r["effect"],
            confidence=r["confidence"],
            notes=r.get("notes", ""),
        )
    return G

def find_paths(G, source: str, target: str, max_hops: int = 3) -> list[list[str]]:
    if nx is None:
        raise ImportError("networkx required for path search.")
    paths = []
    for path in nx.all_simple_paths(G, source=source, target=target, cutoff=max_hops):
        paths.append(path)
    return paths

def summarize_graph(G) -> str:
    if nx is None:
        raise ImportError("networkx required for graph summary.")
    lines = [f"Nodes: {G.number_of_nodes()} | Edges: {G.number_of_edges()}\\n"]
    shown = 0
    for u, v, d in G.edges(data=True):
        lines.append(f"  {u} -> {v}  [{d.get('effect')}, {d.get('confidence')}]  - {d.get('notes')}")
        shown += 1
        if shown >= 8:
            break
    return "\\n".join(lines)

def load_hemovita_graph(
    xlsx_path: Path, edges_path: Path, strict: bool = True, return_validation: bool = True
):
    sheets = list_sheet_names(xlsx_path)
    edges = load_edges_csv(edges_path)
    report = validate_node_alignment(sheets, edges)
    if strict and report["unknown_nodes"]:
        raise ValueError(f"Unknown nodes in edges (not found as sheet names): {report['unknown_nodes']}")
    G = build_graph(edges)
    return (G, report) if return_validation else G


'''
The purpose of this "hemovita_network_loader.py" is that it is reusable backend module that standardizes loading and validating the nutrient network.

Function	                Purpose
load_edges_csv()	        Reads the network_relationships.csv file and checks it has the right columns.
list_sheet_names()	        Reads the Excel file to get all sheet names (your node labels).
validate_node_alignment()	Confirms that every source/target in the edge list actually exists as a sheet.
build_graph()	            Builds a directed networkx.DiGraph with attributes (effect, confidence, notes).
find_paths()	            Finds all simple directed paths (e.g., vitamin_D → ferritin).
summarize_graph()	        Prints a quick overview of edges and confidence levels.
load_hemovita_graph()	    Master wrapper: loads both Excel + CSV, validates, builds, and returns the graph.


This is necessary because it isolates all the “graph plumbing” so your main notebook does not need to rewrite it.
Think of it as your internal HemoVita network API — small, reliable, reusable.

'''