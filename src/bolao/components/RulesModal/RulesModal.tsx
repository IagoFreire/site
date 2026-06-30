import styles from './RulesModal.module.css';

interface Props {
  onClose: () => void;
}

export function RulesModal({ onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.stickyHeader}>
          <div className={styles.dragHandle} aria-hidden="true" />
          <div className={styles.header}>
            <h2 className={styles.title}>Como funciona o ranking</h2>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
          </div>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Pontuação por aposta</h3>
            <div className={styles.scoreRow}>
              <span className={styles.scoreIcon}>🎯</span>
              <div>
                <p className={styles.scoreLabel}>Placar exato</p>
                <p className={styles.scoreDesc}>Acertou o placar certinho</p>
              </div>
              <span className={styles.scorePts}>10 pts</span>
            </div>
            <div className={styles.scoreRow}>
              <span className={styles.scoreIcon}>✅</span>
              <div>
                <p className={styles.scoreLabel}>Vencedor / Empate certo</p>
                <p className={styles.scoreDesc}>Acertou quem ganhou ou que empatou</p>
              </div>
              <span className={styles.scorePts}>5 pts</span>
            </div>
            <div className={styles.scoreRow}>
              <span className={styles.scoreIcon}>❌</span>
              <div>
                <p className={styles.scoreLabel}>Errou</p>
                <p className={styles.scoreDesc}>Resultado diferente do apostado</p>
              </div>
              <span className={`${styles.scorePts} ${styles.scorePtsZero}`}>0 pts</span>
            </div>
            <p className={styles.penaltyNote}>
              ⚠️ Se o jogo for para pênaltis, apostas de placar valem 0 pts — mesmo que você tenha acertado o vencedor.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>🥅 Aposta em pênaltis</h3>
            <p className={styles.penaltyIntro}>
              Nas fases eliminatórias você pode abrir mão do placar e apostar que o jogo vai para os pênaltis:
            </p>
            <div className={styles.scoreRow}>
              <span className={styles.scoreIcon}>✅</span>
              <div>
                <p className={styles.scoreLabel}>Pênaltis + time certo</p>
                <p className={styles.scoreDesc}>Apostou pênaltis, foi para pênaltis e acertou quem ganhou</p>
              </div>
              <span className={styles.scorePts}>10 pts</span>
            </div>
            <div className={styles.scoreRow}>
              <span className={styles.scoreIcon}>🥅</span>
              <div>
                <p className={styles.scoreLabel}>Pênaltis certo</p>
                <p className={styles.scoreDesc}>Apostou pênaltis e foi, mas errou o time vencedor</p>
              </div>
              <span className={styles.scorePts}>5 pts</span>
            </div>
            <div className={styles.scoreRow}>
              <span className={styles.scoreIcon}>❌</span>
              <div>
                <p className={styles.scoreLabel}>Apostou pênaltis, não foi</p>
                <p className={styles.scoreDesc}>Apostou pênaltis mas o jogo terminou no tempo normal</p>
              </div>
              <span className={`${styles.scorePts} ${styles.scorePtsZero}`}>0 pts</span>
            </div>
            <div className={styles.scoreRow}>
              <span className={styles.scoreIcon}>❌</span>
              <div>
                <p className={styles.scoreLabel}>Apostou placar, foi para pênaltis</p>
                <p className={styles.scoreDesc}>Apostou placar normal mas o jogo foi para pênaltis — zero pontos mesmo acertando o vencedor</p>
              </div>
              <span className={`${styles.scorePts} ${styles.scorePtsZero}`}>0 pts</span>
            </div>
            <p className={styles.penaltyNote}>
              Os multiplicadores de fase se aplicam normalmente às apostas de pênaltis.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Multiplicador de fase</h3>
            <p className={styles.multiplierNote}>
              Nas fases eliminatórias os pontos são multiplicados — cada acerto vale mais!
            </p>
            <div className={styles.multiplierRow}>
              <span>Fase de grupos</span><span className={styles.multiplierVal}>×1</span>
            </div>
            <div className={styles.multiplierRow}>
              <span>Rodada de 32</span><span className={styles.multiplierVal}>×2</span>
            </div>
            <div className={styles.multiplierRow}>
              <span>Oitavas</span><span className={styles.multiplierVal}>×1.5</span>
            </div>
            <div className={styles.multiplierRow}>
              <span>Quartas</span><span className={styles.multiplierVal}>×2</span>
            </div>
            <div className={styles.multiplierRow}>
              <span>Semifinal</span><span className={styles.multiplierVal}>×3</span>
            </div>
            <div className={styles.multiplierRow}>
              <span>Final</span><span className={styles.multiplierVal}>×4</span>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Critério de desempate</h3>
            <p className={styles.tiebreakIntro}>Em caso de empate na pontuação, a colocação é decidida por:</p>
            <div className={styles.tiebreakList}>
              <div className={styles.tiebreakItem}>
                <span className={styles.tiebreakNum}>1</span>
                <span>Maior pontuação total</span>
              </div>
              <div className={styles.tiebreakItem}>
                <span className={styles.tiebreakNum}>2</span>
                <span>Maior sequência atual de acertos 🔥</span>
              </div>
              <div className={styles.tiebreakItem}>
                <span className={styles.tiebreakNum}>3</span>
                <span>Mais placares exatos acertados 🎯</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Conquistas</h3>
            <p className={styles.tiebreakIntro}>Desbloqueie badges conforme evolui no bolão:</p>
            <div className={styles.badgeList}>
              <div className={styles.badgeRow}>
                <span className={styles.badgeIcon}>⚡</span>
                <div>
                  <p className={styles.badgeName}>Relâmpago</p>
                  <p className={styles.badgeDesc}>5 acertos seguidos</p>
                </div>
              </div>
              <div className={styles.badgeRow}>
                <span className={styles.badgeIcon}>🦅</span>
                <div>
                  <p className={styles.badgeName}>Olho de Águia</p>
                  <p className={styles.badgeDesc}>10 acertos seguidos</p>
                </div>
              </div>
              <div className={styles.badgeRow}>
                <span className={styles.badgeIcon}>⭐</span>
                <div>
                  <p className={styles.badgeName}>Craque</p>
                  <p className={styles.badgeDesc}>50 pontos acumulados</p>
                </div>
              </div>
              <div className={styles.badgeRow}>
                <span className={styles.badgeIcon}>🏆</span>
                <div>
                  <p className={styles.badgeName}>Campeão</p>
                  <p className={styles.badgeDesc}>150 pontos acumulados</p>
                </div>
              </div>
              <div className={styles.badgeRow}>
                <span className={styles.badgeIcon}>👑</span>
                <div>
                  <p className={styles.badgeName}>Lenda</p>
                  <p className={styles.badgeDesc}>300 pontos acumulados</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
