<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/functions.php';

if (!isset($_SESSION['admin_id'])) {
    header('Location: index.php');
    exit;
}

try {
    $stmt = $pdo->query('SELECT * FROM contacts ORDER BY created_at DESC');
    $contacts = $stmt->fetchAll();
} catch (PDOException $e) {
    $contacts = [];
}

$csrf = generate_csrf_token();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - <?php echo SITE_NAME; ?></title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f7fa;
            min-height: 100vh;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        header h1 { font-size: 22px; }
        .nav-links a {
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 6px;
            background: rgba(255,255,255,0.2);
            margin-left: 10px;
            font-size: 14px;
        }
        .nav-links a:hover { background: rgba(255,255,255,0.3); }
        .container { padding: 40px; max-width: 1400px; margin: 0 auto; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .stat-card h3 { font-size: 13px; color: #888; text-transform: uppercase; margin-bottom: 10px; }
        .stat-card p { font-size: 32px; font-weight: 700; color: #333; }
        table {
            width: 100%;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        th, td {
            padding: 14px 18px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fb;
            font-weight: 600;
            color: #555;
            font-size: 13px;
            text-transform: uppercase;
        }
        td { font-size: 14px; color: #333; }
        tr:last-child td { border-bottom: none; }
        .delete-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            font-size: 13px;
            cursor: pointer;
        }
        .delete-btn:hover { background: #dc2626; }
        .empty {
            text-align: center;
            padding: 60px 20px;
            color: #888;
            font-size: 16px;
        }
        .message-cell {
            max-width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        @media (max-width: 768px) {
            header { padding: 15px 20px; flex-direction: column; gap: 12px; }
            .container { padding: 20px; }
            table { font-size: 12px; }
            th, td { padding: 10px 8px; }
        }
    </style>
</head>
<body>
    <header>
        <h1><?php echo SITE_NAME; ?> Admin Dashboard</h1>
        <div class="nav-links">
            <span>Welcome, <?php echo htmlspecialchars($_SESSION['admin_username']); ?></span>
            <a href="logout.php">Logout</a>
        </div>
    </header>
    <div class="container">
        <div class="stats">
            <div class="stat-card">
                <h3>Total Contacts</h3>
                <p><?php echo count($contacts); ?></p>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Message</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($contacts)): ?>
                    <tr>
                        <td colspan="7" class="empty">No contacts yet.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($contacts as $c): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($c['created_at']); ?></td>
                            <td><?php echo htmlspecialchars($c['name']); ?></td>
                            <td><?php echo htmlspecialchars($c['email']); ?></td>
                            <td><?php echo htmlspecialchars($c['phone']); ?></td>
                            <td><?php echo htmlspecialchars($c['service']); ?></td>
                            <td class="message-cell" title="<?php echo htmlspecialchars($c['message']); ?>">
                                <?php echo htmlspecialchars($c['message']); ?>
                            </td>
                            <td>
                                <form method="POST" action="delete.php" onsubmit="return confirm('Delete this contact?');">
                                    <input type="hidden" name="csrf" value="<?php echo $csrf; ?>">
                                    <input type="hidden" name="id" value="<?php echo $c['id']; ?>">
                                    <button type="submit" class="delete-btn">Delete</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
