import { createPublicClient, http, formatUnits } from 'viem'
import { injectiveTestnet } from 'viem/chains'

const client = createPublicClient({
  chain: injectiveTestnet,
  transport: http('https://k8s.testnet.json-rpc.injective.network/')
})

// 查询余额
export async function getBalance(address: string) {
  try {
    const balance = await client.getBalance({ address: address as `0x${string}` })
    return { success: true, balance: formatUnits(balance, 18) + ' INJ' }
  } catch (e) {
    return { success: false, error: '查询失败' }
  }
}

// 查询交易状态
export async function getTransactionStatus(hash: string) {
  try {
    const receipt = await client.getTransactionReceipt({ hash: hash as `0x${string}` })
    return {
      success: true,
      status: receipt.status === 'success' ? '成功' : '失败',
      blockNumber: Number(receipt.blockNumber),
      gasUsed: formatUnits(receipt.gasUsed, 0),
      explorerLink: `https://testnet.blockscout.injective.network/tx/${hash}`
    }
  } catch (e) {
    return { success: false, status: '查询中...', message: '交易可能还在处理' }
  }
}

// 获取活动列表（Mock）
export function getCampaigns() {
  return [
    { id: 1, title: 'Injective 插画大赛', reward: '500 USDC', deadline: '2026-07-15', submissions: 12, status: 'active' },
    { id: 2, title: '链游创作挑战', reward: '1000 USDC', deadline: '2026-07-20', submissions: 8, status: 'active' },
    { id: 3, title: '音乐创作大赛', reward: '300 USDC', deadline: '2026-07-10', submissions: 25, status: 'voting' },
    { id: 4, title: 'Meme 创作赛', reward: '200 USDC', deadline: '2026-06-30', submissions: 45, status: 'ended' },
  ]
}

// 获取创作者排名（Mock）
export function getCreatorRanking(address: string) {
  const rankings = [
    { address: '0x1234...5678', name: '创作者A', earnings: 12500, votes: 890, rank: 1 },
    { address: '0xabcd...efgh', name: '创作者B', earnings: 8900, votes: 650, rank: 2 },
    { address: '0x9876...5432', name: '创作者C', earnings: 7200, votes: 520, rank: 3 },
  ]
  return { rank: Math.floor(Math.random() * 50) + 1, total: 150 }
}

// 解释区块链概念
export function explainConcept(concept: string) {
  const explanations: Record<string, string> = {
    'gas': 'Gas 就是区块链上的"手续费"。在 Injective 上，Gas 非常便宜，几乎为零。',
    'usdc': 'USDC 是一种数字货币，1 USDC = 1 美元。你可以把它理解为"区块链上的美元"。',
    'wallet': '钱包就是你在区块链上的"银行账户"。永远不要分享私钥！',
    'sign': '签名就是你在区块链上"确认"一笔交易。就像输入密码一样。',
    'blockchain': '区块链就是一个公开的、不可篡改的账本。',
  }
  return explanations[concept.toLowerCase()] || `${concept} 是一个区块链术语。`
}
