DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      comment VARCHAR(255) NOT NULL,
      image_id INT NOT NULL references images(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


  INSERT INTO comments (username, comment, image_id) VALUES (
      'felixisfun',
      'This is a great screenshot!',
      8
  );

  INSERT INTO comments (username, comment, image_id) VALUES (
      'imadarain',
      'Thanks felixisfun! I am glad you liked it',
      8
  );

  INSERT INTO comments (username, comment, image_id) VALUES (
      'godIsGreat',
      'This is not a great screenshot, I am great',
      8
  );
