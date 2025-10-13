
from pathlib import Path
from hemovita_network_loader import load_hemovita_graph, find_paths, summarize_graph

DATA_DIR = Path("datasets")  # adjust if needed
XLSX = "cleaned_data/Hemovita_Micronutrients.xlsx"
EDGES = "cleaned_data/network_relationships.csv"

if __name__ == "__main__":
    G, report = load_hemovita_graph(XLSX, EDGES, strict=True, return_validation=True)
    print("Validation report:", report)
    print(summarize_graph(G))

    # Example path query: vitamin_D -> ferritin (up to 3 hops)
    try:
        paths = find_paths(G, "vitamin_D", "ferritin", max_hops=3)
        print("\\nPaths vitamin_D -> ferritin (<=3 hops):")
        for p in paths[:10]:
            print("  ", " -> ".join(p))
    except Exception as e:
        print("Path search skipped:", e)

'''
The purpose of "demo_koad_and_query,py is that it is a lightweight demo/test script to make sure everything works.

It essentially:

- Imports functions from hemovita_network_loader.py.
- Loads your .xlsx and .csv files from cleaned_data/.
- Validates that nodes match sheets (warns if not).
- Prints the graph summary.
- Demonstrates a sample path query (e.g., vitamin_D → ferritin).

This script is your sanity check — useful to verify file integrity after data updates, without opening the full notebook.

'''