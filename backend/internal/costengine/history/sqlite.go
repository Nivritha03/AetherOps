package history

import (
	"database/sql"
	"fmt"
	"time"

	_ "modernc.org/sqlite"
)

type Snapshot struct {
	ID        int
	Timestamp time.Time
	NodeName  string
	CPU       float64
	Memory    float64
	Cost      float64
}

type SQLiteStore struct {
	db *sql.DB
}

func NewSQLiteStore(dbPath string) (*SQLiteStore, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}

	query := `
		CREATE TABLE IF NOT EXISTS snapshots (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
			node_name TEXT,
			cpu REAL,
			memory REAL,
			cost REAL
		);
		CREATE TABLE IF NOT EXISTS recommendations (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			status TEXT NOT NULL,
			money_saved REAL NOT NULL,
			resolved_at DATETIME
		);
	`
	_, err = db.Exec(query)
	if err != nil {
		return nil, err
	}

	return &SQLiteStore{db: db}, nil
}

func (s *SQLiteStore) SaveSnapshot(nodeName string, cpu, memory, cost float64) error {
	query := `INSERT INTO snapshots (node_name, cpu, memory, cost) VALUES (?, ?, ?, ?)`
	_, err := s.db.Exec(query, nodeName, cpu, memory, cost)
	return err
}

func (s *SQLiteStore) GetAverages(nodeName string, hours int) (cpuAvg, memAvg float64, err error) {
	query := `
		SELECT AVG(cpu), AVG(memory) 
		FROM snapshots 
		WHERE node_name = ? AND timestamp >= datetime('now', ?)
	`
	timeMod := fmt.Sprintf("-%d hours", hours)
	err = s.db.QueryRow(query, nodeName, timeMod).Scan(&cpuAvg, &memAvg)
	if err != nil {
		return 0, 0, nil 
	}
	return cpuAvg, memAvg, nil
}

func (s *SQLiteStore) ResolveRecommendation(id string, title string, moneySaved float64) error {
	query := `
		INSERT INTO recommendations (id, title, status, money_saved, resolved_at)
		VALUES (?, ?, 'Resolved', ?, datetime('now'))
		ON CONFLICT(id) DO UPDATE SET status='Resolved', money_saved=?, resolved_at=datetime('now')
	`
	_, err := s.db.Exec(query, id, title, moneySaved, moneySaved)
	return err
}

func (s *SQLiteStore) GetResolvedMoneySaved() (float64, error) {
	query := `SELECT COALESCE(SUM(money_saved), 0) FROM recommendations WHERE status = 'Resolved'`
	var total float64
	err := s.db.QueryRow(query).Scan(&total)
	return total, err
}

func (s *SQLiteStore) GetResolvedRecommendations() ([]map[string]interface{}, error) {
	query := `SELECT id, title, money_saved, resolved_at FROM recommendations WHERE status = 'Resolved' ORDER BY resolved_at DESC`
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recs []map[string]interface{}
	for rows.Next() {
		var id, title, resolvedAt string
		var moneySaved float64
		if err := rows.Scan(&id, &title, &moneySaved, &resolvedAt); err != nil {
			return nil, err
		}
		recs = append(recs, map[string]interface{}{
			"id": id,
			"title": title,
			"money_saved": moneySaved,
			"resolved_at": resolvedAt,
		})
	}
	return recs, nil
}
