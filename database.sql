SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `hbalintt` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `hbalintt`;

-- fingering
CREATE TABLE `fingering` (
  `ID` int(11) NOT NULL,
  `fingering` varchar(11) NOT NULL,
  `note` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- fingering_table
CREATE TABLE `fingering_table` (
  `pipeID` int(11) NOT NULL,
  `fingeringID` int(11) NOT NULL,
  `ID` int(11) NOT NULL,
  `UserID` varchar(50) NOT NULL,
  `reputation` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- pipes
CREATE TABLE `pipes` (
  `ID` int(11) NOT NULL,
  `holecount` int(11) NOT NULL,
  `RecorderID` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- recorders
CREATE TABLE `recorders` (
  `description` varchar(500) NOT NULL,
  `RecorderID` varchar(30) NOT NULL,
  `UserID` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- users
CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `color` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- INDEXEK

ALTER TABLE `fingering`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fingering` (`fingering`);

ALTER TABLE `fingering_table`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `pipeID` (`pipeID`,`fingeringID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `fingeringID` (`fingeringID`);

ALTER TABLE `pipes`
  ADD PRIMARY KEY (`ID`,`RecorderID`) USING BTREE,
  ADD KEY `RecorderID` (`RecorderID`);

ALTER TABLE `recorders`
  ADD PRIMARY KEY (`RecorderID`),
  ADD KEY `UserID` (`UserID`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

-- AUTO_INCREMENT

ALTER TABLE `fingering`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `fingering_table`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `pipes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

-- FOREIGN KEY-k

ALTER TABLE `fingering_table`
  ADD CONSTRAINT `fingering_table_ibfk_1` FOREIGN KEY (`pipeID`) REFERENCES `pipes` (`ID`),
  ADD CONSTRAINT `fingering_table_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `fingering_table_ibfk_4` FOREIGN KEY (`fingeringID`) REFERENCES `fingering` (`ID`);

ALTER TABLE `pipes`
  ADD CONSTRAINT `pipes_ibfk_1` FOREIGN KEY (`RecorderID`) REFERENCES `recorders` (`RecorderID`);

ALTER TABLE `recorders`
  ADD CONSTRAINT `recorders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`username`);

COMMIT;