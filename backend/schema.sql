CREATE TABLE user_permissions (
	id INTEGER NOT NULL, 
	username VARCHAR, 
	current_role VARCHAR, 
	accumulated_permissions JSON, 
	risk_score INTEGER, 
	last_updated DATETIME, 
	PRIMARY KEY (id)
);

