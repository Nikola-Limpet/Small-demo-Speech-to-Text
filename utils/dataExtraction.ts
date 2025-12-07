/**
 * Data Extraction Service
 * Extracts structured information from voice transcriptions
 */

export interface ExtractedEntity {
  type: 'person' | 'organization' | 'location' | 'date' | 'time' | 'number' | 'email' | 'phone' | 'action' | 'topic'
  value: string
  confidence: number
  position: { start: number; end: number }
}

export interface ExtractedIntent {
  intent: string
  confidence: number
  params: Record<string, string>
}

export interface ConversationContext {
  topics: string[]
  entities: ExtractedEntity[]
  sentiment: 'positive' | 'neutral' | 'negative'
  language: 'en' | 'km' | 'mixed'
  turnCount: number
  lastUpdated: Date
}

export interface UserInfo {
  name?: string
  preferences: string[]
  interests: string[]
  contactInfo: {
    email?: string
    phone?: string
  }
  recentTopics: string[]
  language: 'en' | 'km' | 'mixed'
}

export interface ExtractionResult {
  entities: ExtractedEntity[]
  intents: ExtractedIntent[]
  keywords: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  language: 'en' | 'km' | 'mixed'
  summary: string
  actionItems: string[]
}

// Regex patterns for entity extraction
const PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
  phone: /(?:\+?855|0)?[1-9]\d{7,8}|\+?1?\d{10,11}/g,
  date: /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?(?:,?\s+\d{4})?)/gi,
  time: /\b(?:[01]?\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:\s*[ap]\.?m\.?)?|\b(?:1[0-2]|0?[1-9])(?::[0-5]\d)?\s*[ap]\.?m\.?\b/gi,
  number: /\b\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:dollars?|usd|\$|៛|riel|percent|%|kg|km|m|cm))?\b/gi,
  khmerText: /[\u1780-\u17FF]+/g,
}

// Action verb patterns
const ACTION_VERBS = [
  'schedule', 'book', 'order', 'send', 'call', 'email', 'remind', 'create',
  'update', 'delete', 'cancel', 'confirm', 'check', 'find', 'search', 'buy',
  'sell', 'pay', 'transfer', 'submit', 'review', 'approve', 'reject', 'set',
  'add', 'remove', 'start', 'stop', 'open', 'close', 'save', 'export'
]

// Topic keywords
const TOPIC_KEYWORDS = {
  business: ['meeting', 'project', 'deadline', 'client', 'sales', 'revenue', 'report', 'budget'],
  personal: ['family', 'home', 'vacation', 'birthday', 'appointment', 'doctor'],
  technical: ['code', 'bug', 'feature', 'deploy', 'server', 'database', 'api'],
  communication: ['email', 'call', 'message', 'chat', 'respond', 'reply'],
  finance: ['payment', 'invoice', 'transaction', 'balance', 'transfer', 'account']
}

/**
 * Detect language from text
 */
export function detectLanguage(text: string): 'en' | 'km' | 'mixed' {
  const khmerMatches = text.match(PATTERNS.khmerText) || []
  const khmerLength = khmerMatches.join('').length
  const totalLength = text.replace(/\s/g, '').length

  if (totalLength === 0) return 'en'

  const khmerRatio = khmerLength / totalLength

  if (khmerRatio > 0.7) return 'km'
  if (khmerRatio > 0.2) return 'mixed'
  return 'en'
}

/**
 * Analyze sentiment from text
 */
export function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const lowerText = text.toLowerCase()

  const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'thanks', 'perfect', 'amazing', 'wonderful', 'pleased', 'satisfied', 'success', 'ល្អ', 'អរគុណ']
  const negativeWords = ['bad', 'terrible', 'hate', 'angry', 'disappointed', 'problem', 'issue', 'wrong', 'fail', 'error', 'cancel', 'មិនល្អ', 'បញ្ហា']

  let score = 0
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score++
  })
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score--
  })

  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  return 'neutral'
}

/**
 * Extract entities from text
 */
export function extractEntities(text: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = []

  // Extract emails
  let match
  while ((match = PATTERNS.email.exec(text)) !== null) {
    entities.push({
      type: 'email',
      value: match[0],
      confidence: 0.95,
      position: { start: match.index, end: match.index + match[0].length }
    })
  }

  // Extract phone numbers
  PATTERNS.phone.lastIndex = 0
  while ((match = PATTERNS.phone.exec(text)) !== null) {
    entities.push({
      type: 'phone',
      value: match[0],
      confidence: 0.85,
      position: { start: match.index, end: match.index + match[0].length }
    })
  }

  // Extract dates
  PATTERNS.date.lastIndex = 0
  while ((match = PATTERNS.date.exec(text)) !== null) {
    entities.push({
      type: 'date',
      value: match[0],
      confidence: 0.8,
      position: { start: match.index, end: match.index + match[0].length }
    })
  }

  // Extract times
  PATTERNS.time.lastIndex = 0
  while ((match = PATTERNS.time.exec(text)) !== null) {
    entities.push({
      type: 'time',
      value: match[0],
      confidence: 0.85,
      position: { start: match.index, end: match.index + match[0].length }
    })
  }

  // Extract numbers with units
  PATTERNS.number.lastIndex = 0
  while ((match = PATTERNS.number.exec(text)) !== null) {
    entities.push({
      type: 'number',
      value: match[0],
      confidence: 0.75,
      position: { start: match.index, end: match.index + match[0].length }
    })
  }

  return entities
}

/**
 * Extract action items from text
 */
export function extractActionItems(text: string): string[] {
  const actionItems: string[] = []
  const sentences = text.split(/[.!?]+/).filter(s => s.trim())

  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase().trim()

    // Check for action verbs
    const hasActionVerb = ACTION_VERBS.some(verb => {
      const verbPattern = new RegExp(`\\b${verb}(?:s|ed|ing)?\\b`, 'i')
      return verbPattern.test(lowerSentence)
    })

    // Check for imperative patterns
    const isImperative = /^(?:please\s+)?(?:can you|could you|would you|i need to|i want to|let's|we should|we need to)/i.test(lowerSentence)

    if (hasActionVerb || isImperative) {
      const cleanItem = sentence.trim()
      if (cleanItem.length > 5 && cleanItem.length < 200) {
        actionItems.push(cleanItem)
      }
    }
  })

  return actionItems.slice(0, 10) // Limit to 10 action items
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s\u1780-\u17FF]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)

  // Count word frequency
  const wordCount = new Map<string, number>()
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'this', 'that', 'with', 'have', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'will', 'other', 'about', 'into', 'more', 'some', 'could', 'would', 'make', 'like', 'time', 'just', 'know', 'take', 'come', 'these', 'than', 'then', 'what', 'there'])

  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    }
  })

  // Sort by frequency and return top keywords
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)
}

/**
 * Detect topics from text
 */
export function detectTopics(text: string): string[] {
  const lowerText = text.toLowerCase()
  const detectedTopics: string[] = []

  Object.entries(TOPIC_KEYWORDS).forEach(([topic, keywords]) => {
    const matchCount = keywords.filter(keyword => lowerText.includes(keyword)).length
    if (matchCount >= 2) {
      detectedTopics.push(topic)
    }
  })

  return detectedTopics
}

/**
 * Extract intents from text
 */
export function extractIntents(text: string): ExtractedIntent[] {
  const intents: ExtractedIntent[] = []
  const lowerText = text.toLowerCase()

  // Scheduling intent
  if (/\b(?:schedule|book|set up|arrange|plan)\s+(?:a\s+)?(?:meeting|appointment|call|session)/i.test(text)) {
    const dateMatch = text.match(PATTERNS.date)
    const timeMatch = text.match(PATTERNS.time)
    intents.push({
      intent: 'schedule',
      confidence: 0.85,
      params: {
        date: dateMatch?.[0] || '',
        time: timeMatch?.[0] || ''
      }
    })
  }

  // Search intent
  if (/\b(?:find|search|look for|look up|get me)\b/i.test(text)) {
    intents.push({
      intent: 'search',
      confidence: 0.8,
      params: {}
    })
  }

  // Reminder intent
  if (/\b(?:remind|reminder|don't forget|remember to)\b/i.test(text)) {
    intents.push({
      intent: 'reminder',
      confidence: 0.85,
      params: {}
    })
  }

  // Communication intent
  if (/\b(?:send|email|call|message|text|contact)\b/i.test(text)) {
    const emailMatch = text.match(PATTERNS.email)
    const phoneMatch = text.match(PATTERNS.phone)
    intents.push({
      intent: 'communicate',
      confidence: 0.8,
      params: {
        email: emailMatch?.[0] || '',
        phone: phoneMatch?.[0] || ''
      }
    })
  }

  // Question intent
  if (/^(?:what|who|where|when|why|how|is|are|can|could|would|do|does)\b/i.test(lowerText)) {
    intents.push({
      intent: 'question',
      confidence: 0.9,
      params: {}
    })
  }

  return intents
}

/**
 * Generate a brief summary of the text
 */
export function generateSummary(text: string, maxLength: number = 150): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)

  if (sentences.length === 0) return text.slice(0, maxLength)
  if (sentences.length === 1) return sentences[0].trim()

  // Return first sentence or truncated text
  const summary = sentences[0].trim()
  return summary.length > maxLength ? summary.slice(0, maxLength) + '...' : summary
}

/**
 * Main extraction function - processes text and returns structured data
 */
export function extractFromTranscription(text: string): ExtractionResult {
  if (!text || text.trim().length === 0) {
    return {
      entities: [],
      intents: [],
      keywords: [],
      sentiment: 'neutral',
      language: 'en',
      summary: '',
      actionItems: []
    }
  }

  return {
    entities: extractEntities(text),
    intents: extractIntents(text),
    keywords: extractKeywords(text),
    sentiment: analyzeSentiment(text),
    language: detectLanguage(text),
    summary: generateSummary(text),
    actionItems: extractActionItems(text)
  }
}

/**
 * Context Manager - maintains conversation context across turns
 */
export class ConversationContextManager {
  private context: ConversationContext
  private userInfo: UserInfo

  constructor() {
    this.context = {
      topics: [],
      entities: [],
      sentiment: 'neutral',
      language: 'en',
      turnCount: 0,
      lastUpdated: new Date()
    }

    this.userInfo = {
      preferences: [],
      interests: [],
      contactInfo: {},
      recentTopics: [],
      language: 'en'
    }
  }

  /**
   * Update context with new transcription
   */
  updateContext(extraction: ExtractionResult): void {
    this.context.turnCount++
    this.context.lastUpdated = new Date()
    this.context.sentiment = extraction.sentiment
    this.context.language = extraction.language

    // Merge entities (keep last 50)
    this.context.entities = [...extraction.entities, ...this.context.entities].slice(0, 50)

    // Update topics
    const newTopics = detectTopics(extraction.keywords.join(' '))
    this.context.topics = [...new Set([...newTopics, ...this.context.topics])].slice(0, 10)

    // Update user info
    this.updateUserInfo(extraction)
  }

  /**
   * Update user info based on extraction
   */
  private updateUserInfo(extraction: ExtractionResult): void {
    // Extract contact info
    extraction.entities.forEach(entity => {
      if (entity.type === 'email' && !this.userInfo.contactInfo.email) {
        this.userInfo.contactInfo.email = entity.value
      }
      if (entity.type === 'phone' && !this.userInfo.contactInfo.phone) {
        this.userInfo.contactInfo.phone = entity.value
      }
    })

    // Update interests based on topics
    this.userInfo.recentTopics = this.context.topics.slice(0, 5)
    this.userInfo.language = extraction.language

    // Infer interests from keywords
    const potentialInterests = extraction.keywords.filter(kw =>
      !['want', 'need', 'like', 'please', 'would', 'could'].includes(kw)
    )
    this.userInfo.interests = [...new Set([...potentialInterests, ...this.userInfo.interests])].slice(0, 20)
  }

  getContext(): ConversationContext {
    return { ...this.context }
  }

  getUserInfo(): UserInfo {
    return { ...this.userInfo }
  }

  reset(): void {
    this.context = {
      topics: [],
      entities: [],
      sentiment: 'neutral',
      language: 'en',
      turnCount: 0,
      lastUpdated: new Date()
    }
    this.userInfo = {
      preferences: [],
      interests: [],
      contactInfo: {},
      recentTopics: [],
      language: 'en'
    }
  }
}

// Singleton instance for global context management
export const contextManager = new ConversationContextManager()
