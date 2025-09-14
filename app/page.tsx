'use client';

import React from 'react';

const MaintenancePage = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#e0e0e0',
      padding: '20px'
    }}>
      <div style={{
        background: '#121212',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
        border: '1px solid #2a2a2a',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(70, 70, 70, 0.1) 0%, transparent 70%)',
          transform: 'rotate(30deg)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          fontSize: '80px',
          marginBottom: '25px',
          color: '#8a2be2',
          textShadow: '0 0 15px rgba(138, 43, 226, 0.5)',
          animation: 'pulse 2s infinite'
        }}>
          <i className="fas fa-tools"></i>
        </div>
        
        <h1 style={{
          fontSize: '32px',
          marginBottom: '20px',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
        }}>
          Сайт временно не работает
        </h1>
        
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          marginBottom: '25px',
          color: '#b0b0b0'
        }}>
          В настоящее время проводятся технические работы и улучшения для вашего удобства.
        </p>
        
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          marginBottom: '25px',
          color: '#b0b0b0'
        }}>
          Приносим извинения за временные неудобства. Мы работаем над тем, чтобы вернуться в ближайшее время.
        </p>
        
        <div style={{
          marginTop: '25px',
          fontSize: '20px',
          color: '#8a2be2'
        }}>
          <i className="fas fa-clock"></i> Ожидаемое время восстановления: 2-3 часа
        </div>
        
        <div style={{
          background: '#1a1a1a',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '30px',
          border: '1px solid #2d2d2d'
        }}>
          <p style={{ marginBottom: '10px', fontSize: '16px' }}>
            Если у вас срочный вопрос, свяжитесь с нами:
          </p>
          <p style={{ marginBottom: '10px', fontSize: '16px' }}>
            <i className="fas fa-envelope"></i> Email:{' '}
            <a href="mailto:Office.delta@bk.ru" style={{
              color: '#9b59b6',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}>
              Office.delta@bk.ru
            </a>
          </p>
          <p style={{ marginBottom: '10px', fontSize: '16px' }}>
            <i className="fas fa-phone"></i> Телефон:{' '}
            <a href="tel:+7 (3452) 51-77-07" style={{
              color: '##9b59b6',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}>
              +7 (3452) 51-77-07
            </a>
          </p>
        </div>
        
        <div style={{
          marginTop: '40px',
          fontSize: '14px',
          color: '#666'
        }}>
          &copy; 2025 Управляющая Компания. Все права защищены.
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
          div > div {
            padding: 30px 20px !important;
          }
          
          h1 {
            font-size: 28px !important;
          }
          
          p {
            font-size: 16px !important;
          }
          
          div > div > div:first-child {
            font-size: 60px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;