import { Router } from 'express';

import { getServerById } from '../services/database.js';
import { fetchSessionHistory, listSessions, sendMessageToAgent } from '../services/ssh.js';
import { decryptPassword } from '../utils/crypto.js';

// mergeParams: true to access :serverId from parent router
export const sessionsRoutes = Router({ mergeParams: true });

// Type for request params with merged parent params
interface SessionParams {
  serverId: string;
}

interface SessionParamsWithId extends SessionParams {
  sessionId: string;
}

/**
 * GET /api/servers/:serverId/sessions
 * List all sessions for an agent on a server
 */
sessionsRoutes.get('/', async (req, res) => {
  try {
    const { serverId } = req.params as SessionParams;
    const agentId = (req.query.agentId as string) || 'main';

    const server = await getServerById(serverId);

    if (!server) {
      return res.status(404).json({ success: false, error: 'Server not found' });
    }

    if (!server.public_ip) {
      return res.status(400).json({ success: false, error: 'Server has no public IP' });
    }

    if (!server.password_encrypted) {
      return res.status(400).json({ success: false, error: 'Server has no password configured' });
    }

    // Decrypt password
    const password = decryptPassword(server.password_encrypted);
    const sshUser = server.ssh_user ?? 'root';
    const sshPort = server.ssh_port ?? 22;

    // Fetch sessions list
    const sessions = await listSessions(server.public_ip, password, agentId, sshUser, sshPort);

    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/servers/:serverId/sessions/:sessionId
 * Get session history (chat messages)
 */
sessionsRoutes.get('/:sessionId', async (req, res) => {
  try {
    const { serverId, sessionId } = req.params as SessionParamsWithId;
    const agentId = (req.query.agentId as string) || 'main';

    const server = await getServerById(serverId);

    if (!server) {
      return res.status(404).json({ success: false, error: 'Server not found' });
    }

    if (!server.public_ip) {
      return res.status(400).json({ success: false, error: 'Server has no public IP' });
    }

    if (!server.password_encrypted) {
      return res.status(400).json({ success: false, error: 'Server has no password configured' });
    }

    // Decrypt password
    const password = decryptPassword(server.password_encrypted);
    const sshUser = server.ssh_user ?? 'root';
    const sshPort = server.ssh_port ?? 22;

    // Fetch session history
    const session = await fetchSessionHistory(
      server.public_ip,
      password,
      sessionId,
      agentId,
      sshUser,
      sshPort,
    );

    res.json({ success: true, data: session });
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/servers/:serverId/sessions/:sessionId/messages
 * Send a message to the agent via OpenClaw CLI
 */
sessionsRoutes.post('/:sessionId/messages', async (req, res) => {
  try {
    const { serverId, sessionId } = req.params as SessionParamsWithId;
    const { content, agentId = 'main' } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ success: false, error: 'Message content is required' });
    }

    const server = await getServerById(serverId);

    if (!server) {
      return res.status(404).json({ success: false, error: 'Server not found' });
    }

    if (!server.public_ip) {
      return res.status(400).json({ success: false, error: 'Server has no public IP' });
    }

    if (!server.password_encrypted) {
      return res.status(400).json({ success: false, error: 'Server has no password configured' });
    }

    // Decrypt password
    const password = decryptPassword(server.password_encrypted);
    const sshUser = server.ssh_user ?? 'root';
    const sshPort = server.ssh_port ?? 22;

    // Send message to OpenClaw agent
    const result = await sendMessageToAgent(
      server.public_ip,
      password,
      sessionId,
      content,
      agentId,
      sshUser,
      sshPort,
    );

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
