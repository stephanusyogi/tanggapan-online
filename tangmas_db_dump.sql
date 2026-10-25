/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: tangmas
-- ------------------------------------------------------
-- Server version	11.4.13-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `admin_register_tokens`
--

DROP TABLE IF EXISTS `admin_register_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_register_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_register_tokens_token_unique` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_register_tokens`
--

LOCK TABLES `admin_register_tokens` WRITE;
/*!40000 ALTER TABLE `admin_register_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_register_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
INSERT INTO `failed_jobs` VALUES
(1,'fcb659d9-67ac-411a-88ef-d7195108f3c7','database','default','{\"uuid\":\"fcb659d9-67ac-411a-88ef-d7195108f3c7\",\"displayName\":\"App\\\\Events\\\\ImportProgress\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:25:\\\"App\\\\Events\\\\ImportProgress\\\":1:{s:7:\\\"message\\\";s:24:\\\"Import sedang dimulai...\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1755072603,\"delay\":null}','Error: Class \"Pusher\\Pusher\" not found in /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php:350\nStack trace:\n#0 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(328): Illuminate\\Broadcasting\\BroadcastManager->pusher()\n#1 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(295): Illuminate\\Broadcasting\\BroadcastManager->createPusherDriver()\n#2 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(266): Illuminate\\Broadcasting\\BroadcastManager->resolve()\n#3 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(255): Illuminate\\Broadcasting\\BroadcastManager->get()\n#4 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(242): Illuminate\\Broadcasting\\BroadcastManager->driver()\n#5 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastEvent.php(93): Illuminate\\Broadcasting\\BroadcastManager->connection()\n#6 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Broadcasting\\BroadcastEvent->handle()\n#7 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#8 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#9 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#10 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#11 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(132): Illuminate\\Container\\Container->call()\n#12 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#13 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#14 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then()\n#15 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(125): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#16 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#17 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#18 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(120): Illuminate\\Pipeline\\Pipeline->then()\n#19 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#20 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#21 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#22 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(394): Illuminate\\Queue\\Worker->process()\n#23 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(180): Illuminate\\Queue\\Worker->runJob()\n#24 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#25 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#26 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#27 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#28 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#29 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#30 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#31 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#32 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#33 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#34 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(1092): Illuminate\\Console\\Command->run()\n#35 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand()\n#36 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(192): Symfony\\Component\\Console\\Application->doRun()\n#37 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#38 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle()\n#39 /home/u606736637/domains/kpungawi.com/public_html/tangmas/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#40 {main}','2025-08-13 08:11:03'),
(2,'c991baa4-c373-46c0-a6bb-ee52411a6d8d','database','default','{\"uuid\":\"c991baa4-c373-46c0-a6bb-ee52411a6d8d\",\"displayName\":\"App\\\\Events\\\\ImportProgress\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:25:\\\"App\\\\Events\\\\ImportProgress\\\":1:{s:7:\\\"message\\\";s:24:\\\"Import sedang dimulai...\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1755072722,\"delay\":null}','Error: Class \"Pusher\\Pusher\" not found in /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php:350\nStack trace:\n#0 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(328): Illuminate\\Broadcasting\\BroadcastManager->pusher()\n#1 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(295): Illuminate\\Broadcasting\\BroadcastManager->createPusherDriver()\n#2 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(266): Illuminate\\Broadcasting\\BroadcastManager->resolve()\n#3 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(255): Illuminate\\Broadcasting\\BroadcastManager->get()\n#4 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(242): Illuminate\\Broadcasting\\BroadcastManager->driver()\n#5 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastEvent.php(93): Illuminate\\Broadcasting\\BroadcastManager->connection()\n#6 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Broadcasting\\BroadcastEvent->handle()\n#7 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#8 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#9 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#10 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#11 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(132): Illuminate\\Container\\Container->call()\n#12 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#13 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#14 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then()\n#15 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(125): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#16 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#17 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#18 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(120): Illuminate\\Pipeline\\Pipeline->then()\n#19 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#20 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#21 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#22 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(394): Illuminate\\Queue\\Worker->process()\n#23 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(180): Illuminate\\Queue\\Worker->runJob()\n#24 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#25 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#26 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#27 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#28 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#29 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#30 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#31 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#32 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#33 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#34 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(1092): Illuminate\\Console\\Command->run()\n#35 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand()\n#36 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(192): Symfony\\Component\\Console\\Application->doRun()\n#37 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#38 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle()\n#39 /home/u606736637/domains/kpungawi.com/public_html/tangmas/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#40 {main}','2025-08-13 08:13:03'),
(3,'e6a4519d-c610-437d-82cc-208dcc643704','database','default','{\"uuid\":\"e6a4519d-c610-437d-82cc-208dcc643704\",\"displayName\":\"App\\\\Jobs\\\\ImportCsvJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ImportCsvJob\",\"command\":\"O:21:\\\"App\\\\Jobs\\\\ImportCsvJob\\\":1:{s:7:\\\"\\u0000*\\u0000path\\\";s:49:\\\"temp\\/CEo15jCZM9UJXYOe5DGqm9cnNsy9oNhlOkKqPUsh.csv\\\";}\"},\"createdAt\":1755072547,\"delay\":null}','Illuminate\\Queue\\TimeoutExceededException: App\\Jobs\\ImportCsvJob has timed out. in /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/TimeoutExceededException.php:15\nStack trace:\n#0 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(820): Illuminate\\Queue\\TimeoutExceededException::forJob()\n#1 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(221): Illuminate\\Queue\\Worker->timeoutExceededException()\n#2 /home/u606736637/domains/kpungawi.com/public_html/tangmas/app/Jobs/ImportCsvJob.php(35): Illuminate\\Queue\\Worker->Illuminate\\Queue\\{closure}()\n#3 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): App\\Jobs\\ImportCsvJob->handle()\n#4 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#5 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#6 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#7 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#8 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(132): Illuminate\\Container\\Container->call()\n#9 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#10 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#11 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then()\n#12 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(125): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#13 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#14 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#15 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(120): Illuminate\\Pipeline\\Pipeline->then()\n#16 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#17 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#18 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#19 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(394): Illuminate\\Queue\\Worker->process()\n#20 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(180): Illuminate\\Queue\\Worker->runJob()\n#21 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#22 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#23 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#24 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#25 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#26 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#27 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#28 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#29 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#30 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#31 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(1092): Illuminate\\Console\\Command->run()\n#32 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand()\n#33 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(192): Symfony\\Component\\Console\\Application->doRun()\n#34 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#35 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle()\n#36 /home/u606736637/domains/kpungawi.com/public_html/tangmas/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#37 {main}','2025-08-13 08:15:02'),
(4,'237ba196-8827-4cfa-9cac-8f305de2abcc','database','default','{\"uuid\":\"237ba196-8827-4cfa-9cac-8f305de2abcc\",\"displayName\":\"App\\\\Events\\\\ImportProgress\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:25:\\\"App\\\\Events\\\\ImportProgress\\\":1:{s:7:\\\"message\\\";s:24:\\\"Import sedang dimulai...\\\";}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1755072842,\"delay\":null}','Error: Class \"Pusher\\Pusher\" not found in /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php:350\nStack trace:\n#0 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(328): Illuminate\\Broadcasting\\BroadcastManager->pusher()\n#1 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(295): Illuminate\\Broadcasting\\BroadcastManager->createPusherDriver()\n#2 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(266): Illuminate\\Broadcasting\\BroadcastManager->resolve()\n#3 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(255): Illuminate\\Broadcasting\\BroadcastManager->get()\n#4 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastManager.php(242): Illuminate\\Broadcasting\\BroadcastManager->driver()\n#5 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Broadcasting/BroadcastEvent.php(93): Illuminate\\Broadcasting\\BroadcastManager->connection()\n#6 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Broadcasting\\BroadcastEvent->handle()\n#7 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#8 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#9 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#10 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#11 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(132): Illuminate\\Container\\Container->call()\n#12 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#13 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#14 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then()\n#15 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(125): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#16 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#17 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#18 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(120): Illuminate\\Pipeline\\Pipeline->then()\n#19 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#20 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#21 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#22 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(394): Illuminate\\Queue\\Worker->process()\n#23 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(180): Illuminate\\Queue\\Worker->runJob()\n#24 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#25 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#26 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#27 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#28 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#29 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#30 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#31 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#32 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#33 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#34 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(1092): Illuminate\\Console\\Command->run()\n#35 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand()\n#36 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(192): Symfony\\Component\\Console\\Application->doRun()\n#37 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#38 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle()\n#39 /home/u606736637/domains/kpungawi.com/public_html/tangmas/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#40 {main}','2025-08-13 08:15:03'),
(5,'26d4258d-ea05-4213-96fd-0f1d99e5d552','database','default','{\"uuid\":\"26d4258d-ea05-4213-96fd-0f1d99e5d552\",\"displayName\":\"App\\\\Jobs\\\\ImportCsvJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ImportCsvJob\",\"command\":\"O:21:\\\"App\\\\Jobs\\\\ImportCsvJob\\\":1:{s:7:\\\"\\u0000*\\u0000path\\\";s:49:\\\"temp\\/lfwTyCr8lHektCxYwJVyeLGpHJOHzE8t8OA5HtFo.csv\\\";}\"},\"createdAt\":1755157306,\"delay\":null}','Illuminate\\Queue\\TimeoutExceededException: App\\Jobs\\ImportCsvJob has timed out. in /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/TimeoutExceededException.php:15\nStack trace:\n#0 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(820): Illuminate\\Queue\\TimeoutExceededException::forJob()\n#1 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(221): Illuminate\\Queue\\Worker->timeoutExceededException()\n#2 /home/u606736637/domains/kpungawi.com/public_html/tangmas/app/Jobs/ImportCsvJob.php(35): Illuminate\\Queue\\Worker->Illuminate\\Queue\\{closure}()\n#3 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): App\\Jobs\\ImportCsvJob->handle()\n#4 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#5 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#6 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#7 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#8 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(132): Illuminate\\Container\\Container->call()\n#9 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}()\n#10 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#11 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Bus/Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then()\n#12 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(125): Illuminate\\Bus\\Dispatcher->dispatchNow()\n#13 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}()\n#14 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Pipeline/Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}()\n#15 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(120): Illuminate\\Pipeline\\Pipeline->then()\n#16 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware()\n#17 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Jobs/Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call()\n#18 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#19 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(394): Illuminate\\Queue\\Worker->process()\n#20 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Worker.php(180): Illuminate\\Queue\\Worker->runJob()\n#21 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon()\n#22 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Queue/Console/WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker()\n#23 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#24 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#25 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure()\n#26 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod()\n#27 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Container/Container.php(754): Illuminate\\Container\\BoundMethod::call()\n#28 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(211): Illuminate\\Container\\Container->call()\n#29 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Command/Command.php(318): Illuminate\\Console\\Command->execute()\n#30 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Console/Command.php(180): Symfony\\Component\\Console\\Command\\Command->run()\n#31 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(1092): Illuminate\\Console\\Command->run()\n#32 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand()\n#33 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/symfony/console/Application.php(192): Symfony\\Component\\Console\\Application->doRun()\n#34 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Console/Kernel.php(197): Symfony\\Component\\Console\\Application->run()\n#35 /home/u606736637/domains/kpungawi.com/public_html/tangmas/vendor/laravel/framework/src/Illuminate/Foundation/Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle()\n#36 /home/u606736637/domains/kpungawi.com/public_html/tangmas/artisan(16): Illuminate\\Foundation\\Application->handleCommand()\n#37 {main}','2025-08-14 07:47:03');
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2025_07_14_132229_create_masters_table',1),
(5,'2025_07_14_132620_create_responses_table',1),
(6,'2025_07_14_133110_create_responses_new_table',1),
(7,'2025_07_14_133353_create_responses_change_table',1),
(8,'2025_07_14_133558_create_responses_tms_table',1),
(9,'2025_07_14_133826_create_supporting_evidences_table',1),
(11,'2025_07_19_012724_create_villages_table',1),
(12,'2025_07_19_012654_create_districts_table',2),
(14,'2025_07_29_142625_create_admin_register_tokens_table',3),
(15,'2025_12_03_085315_create_security_rate_limit_attempts_table',3),
(16,'2026_01_05_073654_add_history_columns_to_responses_tms_table',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responses`
--

DROP TABLE IF EXISTS `responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `responses` (
  `id_response` char(36) NOT NULL,
  `tahapan` varchar(255) DEFAULT NULL,
  `alasan_tanggapan` enum('tms','ubah','baru') NOT NULL,
  `nik_responden` varchar(255) NOT NULL,
  `nama_responden` varchar(255) NOT NULL,
  `nomor_responden` varchar(255) NOT NULL,
  `email_responden` varchar(255) DEFAULT NULL,
  `alamat_responden` text NOT NULL,
  `file_scan_ktp_responden` varchar(255) DEFAULT NULL,
  `file_ttd_responden` varchar(255) DEFAULT NULL,
  `status` enum('ongoing','finalized') NOT NULL,
  `status_feedback` enum('diterima','tidak_diterima') DEFAULT NULL,
  `feedback` varchar(255) DEFAULT NULL,
  `file_output` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_response`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responses`
--

LOCK TABLES `responses` WRITE;
/*!40000 ALTER TABLE `responses` DISABLE KEYS */;
INSERT INTO `responses` VALUES
('0285d288-eaec-4578-9dcc-10e80c4c0edb','PDPB Triwulan 2 Tahun 2026','tms','3208092905010009','FAJRIN ALAMSYAH','895617538452','alamsyahfajrin123@gmail.com','KUNINGAN','upload/ktp_pelapor/1782704166_Screenshot 2026-06-29 103532.png','upload/signature/signature_1782704166.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_fajrin-alamsyah_20260629_071356.pdf','2026-06-29 03:36:06','2026-06-29 07:13:57'),
('067a684b-6e72-4375-be95-99f7488380b9','PDPB Triwulan 2 Tahun 2026','tms','3521036910740001','KOMSIATI','85649535163','pawsiswoyo@gmail.com','KEMBANG SORE','upload/ktp_pelapor/1782538152_WhatsApp Image 2026-06-26 at 19.28.19.jpeg','upload/signature/signature_1782538152.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan. Tanggapan akan kami tindak lanjuti sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_komsiati_20260629_014248.pdf','2026-06-27 05:29:12','2026-06-29 01:42:49'),
('0a619930-b37d-4eb2-8633-4f2635933543','PDPB Triwulan 2 Tahun 2026','tms','3521091112920001','ROCHMATULLOH AJI SURYA NEGARA','85732282681','ajisuryanegara@gmail.com','KEC. SIDOREJO, MAGETAN','upload/ktp_pelapor/1782698960_KTP_Surya.pdf','upload/signature/signature_1782698960.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_rochmatulloh-aji-surya-negara_20260629_022304.pdf','2026-06-29 02:09:20','2026-06-29 02:23:05'),
('40d37b0b-5fb9-4e01-a3d9-7540aff7028f','PDPB Triwulan 4 Tahun 2025','tms','3521051407790001','AGUS WINARKO','81275350144','aguswin3521@gmail.com','JL. MELATI NO. 21 RT. 004 RE. 001 KARANGJATI','upload/ktp_pelapor/1762921397_IMG_20251112_111944.jpg','upload/signature/signature_1762921397.png','finalized','diterima','Tanggapan telah diterima, dan akan ditindaklanjuti. Terima kasih.','output/Formulir_Tanggapan_agus-winarko_20251114_014032.pdf','2025-11-12 04:23:17','2025-11-14 01:40:32'),
('5b86a336-f359-4630-a276-d18cbb6c9fb9','PDPB Triwulan 2 Tahun 2026','ubah','3521032704970001','ANWAR SAHRUDIN','8113644600','pawsiswoo@gmail.com','BULAK','upload/ktp_pelapor/1784104421_WhatsApp Image 2026-07-15 at 15.15.33.jpeg','upload/signature/signature_1784104421.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan. Tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_anwar-sahrudin_20260716_014547.pdf','2026-07-15 08:33:41','2026-07-16 01:45:47'),
('708a435d-ad4b-4a82-880d-c4282d2b3abe','PDPB Triwulan 2 Tahun 2026','ubah','3521032704970001','ANWAR SAHRUDIN','8113644600','pawsiswoyo@gmail.com','BULAK','upload/ktp_pelapor/1784103566_WhatsApp Image 2026-07-15 at 15.15.33.jpeg','upload/signature/signature_1784103566.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan. Tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_anwar-sahrudin_20260716_014616.pdf','2026-07-15 08:19:26','2026-07-16 01:46:16'),
('9552ea41-1219-4e1e-b95a-fb3991b2bbab','PDPB Triwulan 4 Tahun 2025','baru','3573050206000010','STEPHANUS YOGI','895604178964','stephanusyogi12@gmail.com','VILLA BUKIT TIDAR A2/76','upload/ktp_pelapor/1764765631_KTP (1).jpg','upload/signature/signature_1764765631.png','finalized','diterima','Tanggapan telah diterima, dan akan ditindaklanjuti. Terima kasih.','output/Formulir_Tanggapan_stephanus-yogi_20251203_124139.pdf','2025-12-03 12:40:31','2025-12-03 12:41:39'),
('9abe19a6-115c-4b61-9a46-d88a313fba03','PDPB Triwulan 2 Tahun 2026','tms','3520116712000001','FITRANTIKA DIASHAFIRA','87771289181','fitrantikadiashafira@gmail.com','DESA KLAGEN GAMBIRAN KECAMATAN MAOSPATI KABUPATEN MAGETAN','upload/ktp_pelapor/1782701291_KTP FIRA.jpeg','upload/signature/signature_1782701291.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_fitrantika-diashafira_20260629_032526.pdf','2026-06-29 02:48:11','2026-06-29 03:25:26'),
('a019d822-858b-45f3-8bdd-7d497ebf641b','PDPB Triwulan 2 Tahun 2026','tms','3522022507940001','JIMAN','85645475962','mujimanalghifari46@gmail.com','RT/RW 001/003 BECOK, DS SUMBERJO, KEC MARGOMULYO BOJONEGORO','upload/ktp_pelapor/1782700723_WhatsApp Image 2026-06-29 at 09.20.49.jpeg','upload/signature/signature_1782700723.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_jiman_20260629_033016.pdf','2026-06-29 02:38:43','2026-06-29 03:30:16'),
('a6ff5f58-b4ce-4f00-acc5-9c2be482c249','PDPB Triwulan 2 Tahun 2026','tms','3522022507940001','JIMAN','85645475962','mujimanalghifari46@gmail.com','RT/RW 001/003 BECOK, DS SUMBERJO, KEC MARGOMULYO BOJONEGORO','upload/ktp_pelapor/1782699757_WhatsApp Image 2026-06-29 at 09.20.49.jpeg','upload/signature/signature_1782699757.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_jiman_20260629_022537.pdf','2026-06-29 02:22:37','2026-06-29 02:25:37'),
('c18a2023-d943-459c-b549-4f60573766d1','PDPB Triwulan 2 Tahun 2026','tms','3520116712000001','FITRANTIKA DIASHAFIRA','87771289179','fitrantikadiashafira@gmail.com','DESA KLAGEN GAMBIRAN KECAMATAN MAOSPATI KABUPATEN MAGETAN','upload/ktp_pelapor/1782701620_KTP FIRA.jpeg','upload/signature/signature_1782701620.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_fitrantika-diashafira_20260629_025626.pdf','2026-06-29 02:53:40','2026-06-29 02:56:26'),
('dd68cd50-b1a0-4b79-899f-45895fc16da2','PDPB Triwulan 2 Tahun 2026','ubah','3521036910740001','KOMSIATI','85649535163','pawsiswoyo@gmail.com','KEMBANGSORE','upload/ktp_pelapor/1782477106_IMG-20260626-WA0003.jpg','upload/signature/signature_1782477106.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan. Tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_komsiati_20260629_013537.pdf','2026-06-26 12:31:46','2026-06-29 01:35:37'),
('eafc4433-ea5b-4363-883d-15b3a85e0438','PDPB Triwulan 2 Tahun 2026','tms','3520116712000001','FITRANTIKA DIASHAFIRA','87771289180','fitrantikadiashafira@gmail.com','DESA KLAGEN GAMBIRAN KECAMATAN MAOSPATI KABUPATEN MAGETAN','upload/ktp_pelapor/1782699512_KTP FIRA.jpeg','upload/signature/signature_1782699512.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_fitrantika-diashafira_20260629_022127.pdf','2026-06-29 02:18:32','2026-06-29 02:21:27'),
('ebda11bd-c72a-4152-afc2-a120503f708c','PDPB Triwulan 2 Tahun 2026','tms','3520116712000001','FITRANTIKA DIASHAFIRA','87771289180','fitrantikadiashafira@gmail.com','DESA KLAGEN GAMBIRAN KECAMATAN MAOSPATI KABUPATEN NGAWI','upload/ktp_pelapor/1782700980_KTP FIRA.jpeg','upload/signature/signature_1782700980.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_fitrantika-diashafira_20260629_032343.pdf','2026-06-29 02:43:00','2026-06-29 03:23:44'),
('f47e8a33-7819-479b-ac94-512d6aafedee','PDPB Triwulan 2 Tahun 2026','tms','3520116712000001','FITRANTIKA DIASHAFIRA','87771289181','fitrantikadiashafira@gmail.com','DESA KLAGEN GAMBIRAN KECAMATAN MAOSPATI KABUPATEN MAGETAN','upload/ktp_pelapor/1782698956_KTP FIRA.jpeg','upload/signature/signature_1782698956.png','finalized','diterima','Terima kasih atas tanggapan yang telah disampaikan.tanggapan akan kami perbarui sesuai dengan saran yang disampaikan.','output/Formulir_Tanggapan_fitrantika-diashafira_20260629_021724.pdf','2026-06-29 02:09:16','2026-06-29 02:17:24');
/*!40000 ALTER TABLE `responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responses_change`
--

DROP TABLE IF EXISTS `responses_change`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `responses_change` (
  `id_response_change` char(36) NOT NULL,
  `id_response` char(36) NOT NULL,
  `nik` varchar(255) NOT NULL,
  `history_nama` varchar(255) DEFAULT NULL,
  `dpid` varchar(255) DEFAULT NULL,
  `nama_pemilih_ubah` varchar(255) DEFAULT NULL,
  `no_kk_ubah` varchar(255) DEFAULT NULL,
  `nik_ubah` varchar(255) DEFAULT NULL,
  `tempat_lahir_ubah` varchar(255) DEFAULT NULL,
  `tanggal_lahir_ubah` date DEFAULT NULL,
  `status_kawin_ubah` enum('B','P','S') DEFAULT NULL,
  `jenis_kelamin_ubah` enum('P','L') DEFAULT NULL,
  `alamat_ubah` text DEFAULT NULL,
  `rt_ubah` varchar(255) DEFAULT NULL,
  `rw_ubah` varchar(255) DEFAULT NULL,
  `kelurahan_ubah` varchar(255) DEFAULT NULL,
  `kecamatan_ubah` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_response_change`),
  KEY `responses_change_id_response_foreign` (`id_response`),
  KEY `responses_change_nik_foreign` (`nik`),
  CONSTRAINT `responses_change_id_response_foreign` FOREIGN KEY (`id_response`) REFERENCES `responses` (`id_response`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responses_change`
--

LOCK TABLES `responses_change` WRITE;
/*!40000 ALTER TABLE `responses_change` DISABLE KEYS */;
INSERT INTO `responses_change` VALUES
('1b8ba5fb-5ccf-40c1-80a4-f74c0fc87090','5b86a336-f359-4630-a276-d18cbb6c9fb9','3521047011970002','WULAN NOVITASARI','81531',NULL,'3521040707260005',NULL,NULL,NULL,NULL,NULL,NULL,'2',NULL,NULL,NULL,'2026-07-15 08:33:41','2026-07-15 08:33:41'),
('56cb9af7-c3c5-4cdc-a98b-464147d1fb88','dd68cd50-b1a0-4b79-899f-45895fc16da2','3521036910740001','KOMSIATI','464243',NULL,NULL,NULL,NULL,'1971-10-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-26 12:31:46','2026-06-26 12:31:46'),
('cce71b14-8519-4c9b-93d8-d90935acfe98','708a435d-ad4b-4a82-880d-c4282d2b3abe','3521032704970001','ANWAR SAHRUDIN','464037',NULL,'3521040707260005',NULL,NULL,NULL,'S',NULL,'BULAK','2','4','GAYAM','KENDAL','2026-07-15 08:19:26','2026-07-15 08:19:26');
/*!40000 ALTER TABLE `responses_change` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responses_new`
--

DROP TABLE IF EXISTS `responses_new`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `responses_new` (
  `id_response_new` char(36) NOT NULL,
  `id_response` char(36) NOT NULL,
  `nama_pemilih` varchar(255) NOT NULL,
  `no_kk` varchar(255) NOT NULL,
  `nik` varchar(255) NOT NULL,
  `tempat_lahir` varchar(255) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `status_kawin` enum('B','P','S') NOT NULL,
  `jenis_kelamin` enum('P','L') NOT NULL,
  `alamat` text NOT NULL,
  `rt` varchar(255) NOT NULL,
  `rw` varchar(255) NOT NULL,
  `kelurahan` varchar(255) NOT NULL,
  `kecamatan` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_response_new`),
  KEY `responses_new_id_response_foreign` (`id_response`),
  CONSTRAINT `responses_new_id_response_foreign` FOREIGN KEY (`id_response`) REFERENCES `responses` (`id_response`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responses_new`
--

LOCK TABLES `responses_new` WRITE;
/*!40000 ALTER TABLE `responses_new` DISABLE KEYS */;
INSERT INTO `responses_new` VALUES
('198330c5-a105-46b3-955d-df4f6afa1913','9552ea41-1219-4e1e-b95a-fb3991b2bbab','SUGITO','3521072503140005','3521071002850006','NGAWI','1985-02-10','S','L','SUMBERAN','5','3','REJOMULYO','KARANGJATI','2025-12-03 12:40:31','2025-12-03 12:40:31');
/*!40000 ALTER TABLE `responses_new` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responses_tms`
--

DROP TABLE IF EXISTS `responses_tms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `responses_tms` (
  `id_response_tms` char(36) NOT NULL,
  `id_response` char(36) NOT NULL,
  `nik` varchar(255) NOT NULL,
  `kategori_tms` enum('MENINGGAL (1)','GANDA (2)','DI BAWAH UMUR (3)','PINDAH DOMISILI (4)','WNA (5)','TNI (6)','POLRI (7)','HAK POLITIK DICABUT (8)') NOT NULL,
  `keterangan` text DEFAULT NULL,
  `history_nik` varchar(255) DEFAULT NULL,
  `history_nkk` varchar(255) DEFAULT NULL,
  `history_nama` varchar(255) DEFAULT NULL,
  `history_tempat_lahir` varchar(255) DEFAULT NULL,
  `history_tanggal_lahir` date DEFAULT NULL,
  `history_alamat` text DEFAULT NULL,
  `history_rt` varchar(255) DEFAULT NULL,
  `history_rw` varchar(255) DEFAULT NULL,
  `history_kelurahan` varchar(255) DEFAULT NULL,
  `history_kecamatan` varchar(255) DEFAULT NULL,
  `history_status_kawin` enum('B','P','S') DEFAULT NULL,
  `history_jenis_kelamin` enum('P','L') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_response_tms`),
  KEY `responses_tms_id_response_foreign` (`id_response`),
  KEY `responses_tms_nik_foreign` (`nik`),
  CONSTRAINT `responses_tms_id_response_foreign` FOREIGN KEY (`id_response`) REFERENCES `responses` (`id_response`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responses_tms`
--

LOCK TABLES `responses_tms` WRITE;
/*!40000 ALTER TABLE `responses_tms` DISABLE KEYS */;
INSERT INTO `responses_tms` VALUES
('15575b37-2621-44fa-af92-2bd8d7a15622','0285d288-eaec-4578-9dcc-10e80c4c0edb','3521046106250002','MENINGGAL (1)',NULL,'3521046106250002','3521041602068113','SOERATOEN','NGAWI','1925-06-21','KRAJAN','4','2','MAJASEM','KENDAL','P','P','2026-06-29 03:36:06','2026-06-29 03:36:06'),
('15d79c4a-bf5f-47c3-b467-80d99d261fa4','f47e8a33-7819-479b-ac94-512d6aafedee','3521113007240001','MENINGGAL (1)',NULL,'3521113007240001','3521112302066478','HARJO SUWARNO','NGAWI','1924-07-30','SUMBERAGUNG','1','6','JATIGEMBOL','KEDUNGGALAR','P','L','2026-06-29 02:09:16','2026-06-29 02:09:16'),
('261d052f-5017-4061-97be-314f2b7d7780','ebda11bd-c72a-4152-afc2-a120503f708c','3521104209230001','MENINGGAL (1)',NULL,'3521104209230001','3521102409090006','MESINAH','NGAWI','1923-09-02','NGISOR','2','7','KEDUNGPUTRI','PARON','P','P','2026-06-29 02:43:00','2026-06-29 02:43:00'),
('282b6e94-7c80-47d1-af7a-f5d7d3e1edcb','eafc4433-ea5b-4363-883d-15b3a85e0438','3521117006240001','MENINGGAL (1)',NULL,'3521117006240001','3521112402060593','TUKIRAH','NGAWI','1924-06-30','KATIKAN','7','7','KATIKAN','KEDUNGGALAR','S','P','2026-06-29 02:18:32','2026-06-29 02:18:32'),
('6ab5615e-3979-4ee8-8a8c-fc71581aea27','40d37b0b-5fb9-4e01-a3d9-7540aff7028f','3521070110510002','MENINGGAL (1)',NULL,'3521070110510002','3521071802065965','GUNAWAN','NGAWI','1951-10-01','KARANGJATI','4','1','KARANGJATI','KARANGJATI','P','L','2025-11-12 04:23:17','2025-11-12 04:23:17'),
('7c56520b-8b17-4c96-a3f4-7cbe031c66ab','0a619930-b37d-4eb2-8633-4f2635933543','3521097012250010','MENINGGAL (1)',NULL,'3521097012250010','3521092707200003','KASI','NGAWI','1925-12-30','KANDANGAN I','1','4','KANDANGAN','NGAWI','P','P','2026-06-29 02:09:20','2026-06-29 02:09:20'),
('82d3f7cb-3db6-4688-b767-393fb07222fa','067a684b-6e72-4375-be95-99f7488380b9','3521035804570001','MENINGGAL (1)',NULL,'3521035804570001','3521031502066783','SINEM','NGAWI','1957-04-18','KEMBANGSORE','3','2','TALANG','JOGOROGO','S','P','2026-06-27 05:29:12','2026-06-27 05:29:12'),
('92a175b7-23be-49b0-a026-c667f53d7d9f','a6ff5f58-b4ce-4f00-acc5-9c2be482c249','3521074105250002','MENINGGAL (1)',NULL,'3521074105250002','3521071802065218','IJEM','NGAWI','1925-05-01','KARANGJATI','2','9','KARANGJATI','KARANGJATI','P','P','2026-06-29 02:22:37','2026-06-29 02:22:37'),
('9402e0bc-3542-4fc9-a42e-2a8df2dfc6cc','a019d822-858b-45f3-8bdd-7d497ebf641b','3521050507250001','MENINGGAL (1)',NULL,'3521050507250001','3521051204080007','RASIMIN','NGAWI','1925-07-05','KERSO I','4','5','KERSOHARJO','GENENG','S','L','2026-06-29 02:38:43','2026-06-29 02:38:43'),
('bad6a680-d5e1-450f-921e-046d52bbef04','9abe19a6-115c-4b61-9a46-d88a313fba03','3521107112210008','MENINGGAL (1)',NULL,'3521107112210008','3521102302062369','MUSIYATUN','NGAWI','1921-12-31','SIRIGAN','1','3','SIRIGAN','PARON','P','P','2026-06-29 02:48:11','2026-06-29 02:48:11'),
('e3a280fd-86b8-456f-8138-b1b41adef307','c18a2023-d943-459c-b549-4f60573766d1','3521105503250001','MENINGGAL (1)',NULL,'3521105503250001','3521102302061070','SIRMI','NGAWI','1925-03-15','MELIKAN','8','5','TEMPURAN','PARON','P','P','2026-06-29 02:53:40','2026-06-29 02:53:40');
/*!40000 ALTER TABLE `responses_tms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_rate_limit_attempts`
--

DROP TABLE IF EXISTS `security_rate_limit_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_rate_limit_attempts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ip` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `attempts` int(11) NOT NULL DEFAULT 1,
  `reset_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `security_rate_limit_attempts_ip_action_index` (`ip`,`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_rate_limit_attempts`
--

LOCK TABLES `security_rate_limit_attempts` WRITE;
/*!40000 ALTER TABLE `security_rate_limit_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `security_rate_limit_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supporting_evidences`
--

DROP TABLE IF EXISTS `supporting_evidences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supporting_evidences` (
  `id_evidence` char(36) NOT NULL,
  `id_response` char(36) NOT NULL,
  `file_scan_ktp` varchar(255) NOT NULL,
  `file_scan_kk` varchar(255) NOT NULL,
  `file_scan_lain` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_evidence`),
  KEY `supporting_evidences_id_response_foreign` (`id_response`),
  CONSTRAINT `supporting_evidences_id_response_foreign` FOREIGN KEY (`id_response`) REFERENCES `responses` (`id_response`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supporting_evidences`
--

LOCK TABLES `supporting_evidences` WRITE;
/*!40000 ALTER TABLE `supporting_evidences` DISABLE KEYS */;
INSERT INTO `supporting_evidences` VALUES
('10b062b1-84d5-483b-b81f-fe9b01fd24f8','0a619930-b37d-4eb2-8633-4f2635933543','upload/response_tms/1782698960_Suket Pemakaman_Kasi.pdf','upload/response_tms/1782698960_Suket Pemakaman_Kasi.pdf','upload/response_tms/1782698960_Suket Pemakaman_Kasi.pdf','2026-06-29 02:09:20','2026-06-29 02:09:20'),
('1f33ca3b-3982-4d50-a409-c828e095e543','f47e8a33-7819-479b-ac94-512d6aafedee','upload/response_tms/1782698956_HARJO SUWARNO.pdf','upload/response_tms/1782698956_HARJO SUWARNO.pdf','upload/response_tms/1782698956_HARJO SUWARNO.pdf','2026-06-29 02:09:16','2026-06-29 02:09:16'),
('2880bfa7-9791-4fdf-916b-baf14b698deb','9abe19a6-115c-4b61-9a46-d88a313fba03','upload/response_tms/1782701291_MUSIYATUN.pdf','upload/response_tms/1782701291_MUSIYATUN.pdf','upload/response_tms/1782701291_MUSIYATUN.pdf','2026-06-29 02:48:11','2026-06-29 02:48:11'),
('29092f4e-c86e-4d4b-8e1b-089e7ea3e1fc','ebda11bd-c72a-4152-afc2-a120503f708c','upload/response_tms/1782700980_Mesinah, Kedungputri.pdf','upload/response_tms/1782700980_Mesinah, Kedungputri.pdf','upload/response_tms/1782700980_Mesinah, Kedungputri.pdf','2026-06-29 02:43:00','2026-06-29 02:43:00'),
('52347c44-4a3f-4691-b183-83f5970cea34','067a684b-6e72-4375-be95-99f7488380b9','upload/response_tms/1782538152_WhatsApp Image 2026-06-26 at 20.02.23.jpeg','upload/response_tms/1782538152_WhatsApp Image 2026-06-26 at 20.02.23.jpeg','upload/response_tms/1782538152_WhatsApp Image 2026-06-26 at 20.02.23.jpeg','2026-06-27 05:29:12','2026-06-27 05:29:12'),
('6c0c54a8-ccb5-48ea-bbce-9e24c4cf0ec2','eafc4433-ea5b-4363-883d-15b3a85e0438','upload/response_tms/1782699512_TUKIRAH.pdf','upload/response_tms/1782699512_TUKIRAH.pdf','upload/response_tms/1782699512_TUKIRAH.pdf','2026-06-29 02:18:32','2026-06-29 02:18:32'),
('6d7339ab-0102-4f3b-969b-25f0421d552b','a6ff5f58-b4ce-4f00-acc5-9c2be482c249','upload/response_tms/1782699757_Tangmas Ijem Karangjati MD.pdf','upload/response_tms/1782699757_Tangmas Ijem Karangjati MD.pdf','upload/response_tms/1782699757_Tangmas Ijem Karangjati MD.pdf','2026-06-29 02:22:37','2026-06-29 02:22:37'),
('837a964f-40a0-408b-879e-dd3fd30bebb9','a019d822-858b-45f3-8bdd-7d497ebf641b','upload/response_tms/1782700723_Tangmas Rasmini Kersoharjo MD.pdf','upload/response_tms/1782700723_Tangmas Rasmini Kersoharjo MD.pdf','upload/response_tms/1782700723_Tangmas Rasmini Kersoharjo MD.pdf','2026-06-29 02:38:43','2026-06-29 02:38:43'),
('93554638-480c-4773-9497-8a2bfb64d975','5b86a336-f359-4630-a276-d18cbb6c9fb9','upload/response_ubah/1784104421_WhatsApp Image 2026-07-15 at 15.15.33.jpeg','upload/response_ubah/1784104421_WhatsApp Image 2026-07-15 at 15.15.33.jpeg','upload/response_ubah/1784104421_WhatsApp Image 2026-07-15 at 15.15.33.jpeg','2026-07-15 08:33:41','2026-07-15 08:33:41'),
('ad9d575d-3d36-4ff2-8bdc-5b7c854b12fe','0285d288-eaec-4578-9dcc-10e80c4c0edb','upload/response_tms/1782704166_Doc0043-4-6-1.pdf','upload/response_tms/1782704166_Doc0043-4-6-2.pdf','upload/response_tms/1782704166_Doc0043-4-6-3.pdf','2026-06-29 03:36:06','2026-06-29 03:36:06'),
('b21a774b-539f-4607-b1ff-4aa6bbabb752','708a435d-ad4b-4a82-880d-c4282d2b3abe','upload/response_ubah/1784103566_WhatsApp Image 2026-07-15 at 15.15.33.jpeg','upload/response_ubah/1784103566_WhatsApp Image 2026-07-15 at 15.15.33.jpeg','upload/response_ubah/1784103566_WhatsApp Image 2026-07-15 at 15.15.33.jpeg','2026-07-15 08:19:26','2026-07-15 08:19:26'),
('c36236f1-652b-442c-8a94-f95db4690068','40d37b0b-5fb9-4e01-a3d9-7540aff7028f','upload/response_tms/1762921397_IMG_20251112_102743.jpg','upload/response_tms/1762921397_IMG_20251112_102621.jpg','upload/response_tms/1762921397_IMG_20251112_102827.jpg','2025-11-12 04:23:17','2025-11-12 04:23:17'),
('c62e1896-60b2-4bca-a5f8-3cdb80864a8f','9552ea41-1219-4e1e-b95a-fb3991b2bbab','upload/response_new/1764765631_3521071002850006.jpg','upload/response_new/1764765631_3521071002850006.jpg','upload/response_new/1764765631_3521071002850006.jpg','2025-12-03 12:40:31','2025-12-03 12:40:31'),
('eed58d81-f86f-4332-baaf-7dec1a4c07fc','c18a2023-d943-459c-b549-4f60573766d1','upload/response_tms/1782701620_Sirmi, Tempuran.pdf','upload/response_tms/1782701620_Sirmi, Tempuran.pdf','upload/response_tms/1782701620_Sirmi, Tempuran.pdf','2026-06-29 02:53:40','2026-06-29 02:53:40'),
('f1998b0f-a07c-49d4-9bf8-d663dd80cf2a','dd68cd50-b1a0-4b79-899f-45895fc16da2','upload/response_ubah/1782477106_IMG-20260626-WA0001.jpg','upload/response_ubah/1782477106_IMG-20260626-WA0003.jpg','upload/response_ubah/1782477106_IMG-20260626-WA0003.jpg','2026-06-26 12:31:46','2026-06-26 12:31:46');
/*!40000 ALTER TABLE `supporting_evidences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'datinkpungawi','datinkpungawi@gmail.com','102552837337747711398',NULL,'$2y$12$1cwgmoveLztgT/AAOc7jZup0nBBLiGdwrG8j61D3.MTFqK7J2EHD2','https://lh3.googleusercontent.com/a/ACg8ocL_vm5twcPC7mxzpYR-LzcRy4RdLqcCG-gOpaIGlD6_fadFrQ=s96-c','z2BzezlJoW8rfraraUsvqFFGqEdAn15TCbLsVUlQ2itn6qC0FGuYOcEa2oE3','2025-07-27 13:55:09','2025-07-27 13:55:09'),
(2,'suratmasuk kpungawi','suratmasukkpungawi@gmail.com','113872999190807230093',NULL,'$2y$12$3uoj6deYLOb/jB8snUvDneml3yAgoFKTrPAjL8RU6BAP1T5YI/6Qu','https://lh3.googleusercontent.com/a/ACg8ocKxWVAcq6aNgft60T7xUrEepXlvyQuBBdddURB0pXnzmLOnihs=s96-c','cAhvHCrGYjYabhl4OBH6HZn8wVsHz2qwKsMgNubJkfCjtswUCamonEotYjm8','2025-07-30 02:40:23','2025-07-30 02:40:23'),
(3,'Stephanus Yogi','stephanusyogi12@gmail.com','101795690252691296930',NULL,'$2y$12$O7s2fgHsi.BhVkx30LZTQee/lMrI1/2C/xe8PHEQOsSKb93D8fiZe','https://lh3.googleusercontent.com/a/ACg8ocIgJdP_QnkCkMhfjQdaj55GWd5VOE5UNdGaLehrxBkwnAUhMwsl=s96-c','1GBg6LUeWHnmHFES3x0n12iCdz1DAV2xGVfTnT4LtCTsxNupmHTikrOzrec2','2025-07-30 02:45:36','2025-07-30 02:45:36');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-10-25 10:41:54
